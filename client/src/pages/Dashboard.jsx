import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Eye, Video as VideoIcon, ThumbsUp, PlusCircle, Trash2, ExternalLink } from "lucide-react";
import Spinner from "../components/Spinner";
import { getDashboardStats, getDashboardVideos } from "../api/dashboard";
import { togglePublishStatus, deleteVideo } from "../api/video";
import { formatCount, formatDuration, formatDate, getErrorMessage } from "../utils/format";

const PAGE_SIZE = 10;

function StatCard({ label, value, Icon, iconClass }) {
  return (
    <div className="bg-surface-container rounded-xl p-md border border-surface-container-high hover:border-outline-variant transition-colors flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <span className="font-meta-sm text-on-surface-variant">{label}</span>
        <Icon className={`size-5 ${iconClass}`} aria-hidden="true" />
      </div>
      <div className="font-headline-lg text-on-surface">{value}</div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([getDashboardStats(), getDashboardVideos({ page: 1, limit: PAGE_SIZE })])
      .then(([statsRes, videosRes]) => {
        if (!active) return;
        setStats(statsRes.data);
        setVideos(videosRes.data?.videos || []);
        setTotalPages(videosRes.data?.pagination?.totalPages || 1);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Failed to load your dashboard."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const res = await getDashboardVideos({ page: page + 1, limit: PAGE_SIZE });
      setVideos((prev) => [...prev, ...(res.data?.videos || [])]);
      setPage((p) => p + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load more videos."));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggle = async (video) => {
    setPendingId(video._id);
    const next = !video.isPublished;
    setVideos((list) => list.map((v) => (v._id === video._id ? { ...v, isPublished: next } : v)));
    try {
      await togglePublishStatus(video._id);
      toast.success(next ? "Video published" : "Video set to private");
    } catch (err) {
      setVideos((list) => list.map((v) => (v._id === video._id ? { ...v, isPublished: !next } : v)));
      toast.error(getErrorMessage(err, "Could not change visibility."));
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Delete “${video.title}”? This cannot be undone.`)) return;
    setPendingId(video._id);
    try {
      await deleteVideo(video._id);
      setVideos((list) => list.filter((v) => v._id !== video._id));
      setStats((s) => (s ? { ...s, totalVideos: Math.max(0, (s.totalVideos || 0) - 1) } : s));
      toast.success("Video deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete video."));
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-lg flex flex-col gap-lg">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-xs">Channel Dashboard</h1>
          <p className="font-meta-sm text-on-surface-variant">Here's how your content is performing.</p>
        </div>
        <Link
          to="/upload"
          className="bg-primary text-on-primary font-title-md px-md py-sm rounded-lg flex items-center gap-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 w-fit"
        >
          <PlusCircle className="size-5" aria-hidden="true" />
          Upload Video
        </Link>
      </header>

      {error && <p className="font-body-md text-error">{error}</p>}

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          <StatCard label="Subscribers" value={formatCount(stats.totalSubscribers || 0)} Icon={Users} iconClass="text-primary" />
          <StatCard label="Total Views" value={formatCount(stats.totalViews || 0)} Icon={Eye} iconClass="text-tertiary" />
          <StatCard label="Videos" value={(stats.totalVideos || 0).toLocaleString()} Icon={VideoIcon} iconClass="text-secondary" />
          <StatCard label="Total Likes" value={formatCount(stats.totalLikes || 0)} Icon={ThumbsUp} iconClass="text-primary" />
        </section>
      )}

      {/* Content table */}
      <section className="bg-surface-container rounded-xl border border-surface-container-high overflow-hidden flex flex-col">
        <div className="p-md border-b border-surface-container-highest">
          <h2 className="font-title-md text-on-surface">Channel Content</h2>
        </div>

        {videos.length === 0 ? (
          <div className="p-xl flex flex-col items-center gap-md text-center">
            <p className="font-body-md text-on-surface-variant">You haven't uploaded any videos yet.</p>
            <Link
              to="/upload"
              className="bg-primary text-on-primary font-title-md px-lg py-sm rounded-full hover:bg-primary-container transition-colors"
            >
              Upload your first video
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-highest bg-surface-container-low/50">
                    <th className="p-md font-label-xs text-on-surface-variant uppercase tracking-wider">Video</th>
                    <th className="p-md font-label-xs text-on-surface-variant uppercase tracking-wider">Visibility</th>
                    <th className="p-md font-label-xs text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th className="p-md font-label-xs text-on-surface-variant uppercase tracking-wider text-right">Views</th>
                    <th className="p-md font-label-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {videos.map((v) => (
                    <tr key={v._id} className="hover:bg-surface-container-high transition-colors group align-top">
                      <td className="p-md">
                        <div className="flex items-center gap-md max-w-md">
                          <Link
                            to={`/watch/${v._id}`}
                            className="w-24 aspect-video rounded bg-surface-container-lowest shrink-0 overflow-hidden relative"
                          >
                            <img src={v.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white font-label-xs px-1 rounded">
                              {formatDuration(v.duration)}
                            </span>
                          </Link>
                          <Link
                            to={`/watch/${v._id}`}
                            className="font-body-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors"
                          >
                            {v.title}
                          </Link>
                        </div>
                      </td>
                      <td className="p-md">
                        <button
                          onClick={() => handleToggle(v)}
                          disabled={pendingId === v._id}
                          className="flex items-center gap-sm disabled:opacity-60"
                          aria-label={`Set ${v.isPublished ? "private" : "public"}`}
                        >
                          <span
                            className={`w-9 h-5 rounded-full relative flex items-center transition-colors ${
                              v.isPublished ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full absolute transition-all ${
                                v.isPublished ? "bg-on-primary right-1" : "bg-on-surface-variant left-1"
                              }`}
                            />
                          </span>
                          <span className={`font-meta-sm ${v.isPublished ? "text-on-surface" : "text-on-surface-variant"}`}>
                            {v.isPublished ? "Public" : "Private"}
                          </span>
                        </button>
                      </td>
                      <td className="p-md font-meta-sm text-on-surface-variant whitespace-nowrap">
                        {formatDate(v.createdAt)}
                      </td>
                      <td className="p-md font-body-md text-on-surface text-right whitespace-nowrap">
                        {(v.views || 0).toLocaleString()}
                      </td>
                      <td className="p-md">
                        <div className="flex items-center justify-end gap-xs">
                          <Link
                            to={`/watch/${v._id}`}
                            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                            aria-label="View video"
                          >
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={() => handleDelete(v)}
                            disabled={pendingId === v._id}
                            className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-highest transition-colors disabled:opacity-60"
                            aria-label="Delete video"
                          >
                            {pendingId === v._id ? <Spinner className="size-4" /> : <Trash2 className="size-4" aria-hidden="true" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {page < totalPages && (
              <div className="p-md border-t border-surface-container-highest flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="font-title-md text-primary hover:text-primary-container transition-colors flex items-center gap-xs disabled:opacity-60"
                >
                  {loadingMore ? <Spinner className="size-5" /> : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
