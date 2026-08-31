import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, Film, Image as ImageIcon, X, Globe, Lock } from "lucide-react";
import Spinner from "../components/Spinner";
import { publishVideo, togglePublishStatus } from "../api/video";
import { getErrorMessage } from "../utils/format";

const MAX_TITLE = 100;
const MAX_DESC = 1000;

function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function Upload() {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [dragging, setDragging] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [thumbPreview]);

  const pickVideo = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a valid video file.");
      return;
    }
    setVideoFile(file);
    setErrors((e) => ({ ...e, videoFile: undefined }));
  };

  const pickThumb = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
    setErrors((e) => ({ ...e, thumbnail: undefined }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickVideo(e.dataTransfer.files?.[0]);
  };

  const validate = () => {
    const next = {};
    if (!videoFile) next.videoFile = "A video file is required.";
    if (!thumbFile) next.thumbnail = "A thumbnail image is required.";
    const t = title.trim();
    if (t.length < 3) next.title = "Title must be at least 3 characters.";
    else if (t.length > MAX_TITLE) next.title = `Title must be at most ${MAX_TITLE} characters.`;
    const d = description.trim();
    if (d.length < 3) next.description = "Description must be at least 3 characters.";
    else if (d.length > MAX_DESC) next.description = `Description must be at most ${MAX_DESC} characters.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbFile);

    setUploading(true);
    setProgress(0);
    try {
      const res = await publishVideo(formData, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
      });
      const created = res.data;
      // The API always publishes as public; honour a "private" choice with a follow-up toggle.
      if (visibility === "private" && created?._id) {
        try {
          await togglePublishStatus(created._id);
        } catch {
          toast.error("Uploaded, but couldn't set it to private.");
        }
      }
      toast.success("Video published");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed. Please try again."));
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-lg">
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-lg">Upload video</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        {/* Video dropzone */}
        <div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => pickVideo(e.target.files?.[0])}
          />
          {!videoFile ? (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`w-full flex flex-col items-center justify-center gap-md rounded-xl border-2 border-dashed p-xl transition-colors ${
                dragging ? "border-primary bg-surface-container-high" : "border-surface-container-highest bg-surface-container hover:border-outline-variant"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
                <UploadCloud className="size-8 text-primary" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="font-title-md text-on-surface">Drag & drop your video</p>
                <p className="font-meta-sm text-on-surface-variant mt-1">or click to browse</p>
              </div>
            </button>
          ) : (
            <div className="w-full flex items-center gap-md rounded-xl border border-surface-container-highest bg-surface-container p-md">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                <Film className="size-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-on-surface truncate">{videoFile.name}</p>
                <p className="font-meta-sm text-on-surface-variant">{formatBytes(videoFile.size)}</p>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors shrink-0"
                  aria-label="Remove video"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          {errors.videoFile && <p className="font-meta-sm text-error mt-1">{errors.videoFile}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="font-title-md text-on-surface block mb-sm">Thumbnail</label>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickThumb(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => thumbInputRef.current?.click()}
            className="group relative w-full sm:w-80 aspect-video rounded-lg overflow-hidden border border-surface-container-highest bg-surface-container hover:border-outline-variant transition-colors flex items-center justify-center"
          >
            {thumbPreview ? (
              <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                <ImageIcon className="size-8" aria-hidden="true" />
                <span className="font-meta-sm">Select a thumbnail</span>
              </div>
            )}
          </button>
          {errors.thumbnail && <p className="font-meta-sm text-error mt-1">{errors.thumbnail}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="font-title-md text-on-surface block mb-sm">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title that describes your video"
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-md py-2.5 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors font-body-md"
          />
          <div className="flex justify-between mt-1">
            <span className="font-meta-sm text-error">{errors.title || ""}</span>
            <span className="font-meta-sm text-on-surface-variant">{title.length}/{MAX_TITLE}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-title-md text-on-surface block mb-sm">Description</label>
          <textarea
            id="description"
            value={description}
            maxLength={MAX_DESC}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Tell viewers about your video"
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-md py-2.5 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors font-body-md resize-y"
          />
          <div className="flex justify-between mt-1">
            <span className="font-meta-sm text-error">{errors.description || ""}</span>
            <span className="font-meta-sm text-on-surface-variant">{description.length}/{MAX_DESC}</span>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <span className="font-title-md text-on-surface block mb-sm">Visibility</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {[
              { key: "public", label: "Public", desc: "Everyone can watch", Icon: Globe },
              { key: "private", label: "Private", desc: "Only you can watch", Icon: Lock },
            ].map(({ key, label, desc, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setVisibility(key)}
                className={`flex items-center gap-md p-md rounded-xl border text-left transition-colors ${
                  visibility === key
                    ? "border-primary bg-surface-container-high"
                    : "border-surface-container-highest bg-surface-container hover:border-outline-variant"
                }`}
              >
                <Icon className={`size-5 shrink-0 ${visibility === key ? "text-primary" : "text-on-surface-variant"}`} aria-hidden="true" />
                <div>
                  <p className="font-body-md text-on-surface">{label}</p>
                  <p className="font-meta-sm text-on-surface-variant">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="flex flex-col gap-sm">
            <div className="flex justify-between font-meta-sm text-on-surface-variant">
              <span>{progress < 100 ? "Uploading…" : "Processing…"}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-md pt-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={uploading}
            className="px-lg py-2.5 rounded-full font-title-md text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-lg py-2.5 rounded-full bg-primary text-on-primary font-title-md hover:bg-primary-container transition-colors flex items-center gap-sm disabled:opacity-60"
          >
            {uploading ? <Spinner className="size-5" /> : null}
            {uploading ? "Publishing…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
