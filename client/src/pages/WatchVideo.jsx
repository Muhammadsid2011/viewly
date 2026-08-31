import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  BadgeCheck,
  Trash2,
  Send,
} from "lucide-react";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";
import { getVideoById, getVideos, incrementViews } from "../api/video";
import { getUserChannel } from "../api/user";
import { toggleSubscription } from "../api/subscription";
import { toggleVideoLike, getLikedVideos } from "../api/like";
import { getComments, addComment, deleteComment } from "../api/comment";
import useAuthStore from "../store/authStore";
import { formatCount, formatViews, formatDuration, timeAgo, formatDate, getErrorMessage } from "../utils/format";

function WatchVideo() {
  const { videoId } = useParams();
  const currentUser = useAuthStore((s) => s.user);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [channel, setChannel] = useState(null); // { _id, subscribersCount, isSubscribed }
  const [subscribing, setSubscribing] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

  const [descExpanded, setDescExpanded] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [related, setRelated] = useState([]);
  const [videoElement, setVideoElement] = useState(null);

  const isOwnVideo = currentUser && video?.owner?._id === currentUser._id;

  // Increment views when video ends
  useEffect(() => {
    const videoEl = videoElement;
    console.log("[WatchVideo] videoElement:", videoEl, "videoId:", videoId);
    if (!videoEl) return;

    const handleEnded = async () => {
      console.log("[WatchVideo] Video ended, incrementing views...");
      try {
        const res = await incrementViews(videoId);
        console.log("[WatchVideo] Views incremented:", res);
      } catch (err) {
        console.error("[WatchVideo] Failed to increment views:", err);
      }
    };

    videoEl.addEventListener("ended", handleEnded);
    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, [videoId, videoElement]);

  // Primary video fetch
  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      setError("");
      setVideo(null);
      setChannel(null);
      try {
        const res = await getVideoById(videoId);
        if (active) setVideo(res.data);
      } catch (err) {
        if (active) setError(getErrorMessage(err, "This video could not be loaded."));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [videoId]);

  // Channel profile (subscriber count + subscription state) once we know the owner
  useEffect(() => {
    const username = video?.owner?.username;
    if (!username) return;
    let active = true;
    getUserChannel(username)
      .then((res) => {
        if (active) setChannel(res.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [video?.owner?.username]);

  // Comments
  useEffect(() => {
    let active = true;
    getComments(videoId, { page: 1, limit: 50 })
      .then((res) => {
        if (!active) return;
        setComments(res.data?.docs || []);
        setCommentCount(res.data?.totalDocs || 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [videoId]);

  // Related videos
  useEffect(() => {
    let active = true;
    getVideos({ page: 1, limit: 12 })
      .then((res) => {
        if (!active) return;
        setRelated((res.data?.docs || []).filter((v) => v._id !== videoId).slice(0, 10));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [videoId]);

  // Seed the like button state from the user's liked-videos list (no direct
  // "is-liked" endpoint exists, so this is a best-effort lookup).
  useEffect(() => {
    let active = true;
    getLikedVideos({ page: 1, limit: 100 })
      .then((res) => {
        if (!active) return;
        const likedIds = new Set((res.data?.docs || []).map((v) => v._id));
        setLiked(likedIds.has(videoId));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [videoId]);

  const handleSubscribe = async () => {
    if (!channel?._id || subscribing) return;
    setSubscribing(true);
    const wasSubscribed = channel.isSubscribed;
    // optimistic
    setChannel((c) => ({
      ...c,
      isSubscribed: !wasSubscribed,
      subscribersCount: Math.max(0, (c.subscribersCount || 0) + (wasSubscribed ? -1 : 1)),
    }));
    try {
      await toggleSubscription(channel._id);
      toast.success(wasSubscribed ? "Unsubscribed" : "Subscribed");
    } catch (err) {
      // revert
      setChannel((c) => ({
        ...c,
        isSubscribed: wasSubscribed,
        subscribersCount: Math.max(0, (c.subscribersCount || 0) + (wasSubscribed ? 1 : -1)),
      }));
      toast.error(getErrorMessage(err, "Could not update subscription."));
    } finally {
      setSubscribing(false);
    }
  };

  const handleLike = async () => {
    if (likePending) return;
    setLikePending(true);
    try {
      const res = await toggleVideoLike(videoId);
      setLiked(Boolean(res.data?.liked));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update like."));
    } finally {
      setLikePending(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = commentText.trim();
    if (!content || postingComment) return;
    setPostingComment(true);
    try {
      const res = await addComment({ content, video: videoId });
      // The API returns the raw comment without a populated owner, so render it
      // using the logged-in user we already have in the store.
      const created = res.data || {};
      const newComment = {
        _id: created._id || `temp-${Date.now()}`,
        content: created.content ?? content,
        createdAt: created.createdAt || new Date().toISOString(),
        owner: {
          _id: currentUser?._id,
          fullName: currentUser?.fullName,
          username: currentUser?.username,
          avatar: currentUser?.avatar,
        },
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentCount((c) => c + 1);
      setCommentText("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not post comment."));
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = useCallback(async (id) => {
    try {
      await deleteComment(id);
      setComments((list) => list.filter((c) => c._id !== id));
      setCommentCount((c) => Math.max(0, c - 1));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete comment."));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center px-4">
        <p className="font-title-md text-on-surface">{error || "Video not found"}</p>
        <Link to="/" className="px-lg py-2.5 rounded-full bg-primary text-on-primary font-title-md hover:bg-primary/90 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  const owner = video.owner || {};

  return (
    <div className="w-full max-w-[1800px] mx-auto">
      <div className="flex-1 w-full px-4 md:px-lg py-md md:py-lg flex flex-col xl:flex-row gap-lg xl:gap-xl">
        {/* Primary column */}
        <div className="flex-1 min-w-0 max-w-[1280px] w-full">
          <div className="relative w-full rounded-lg md:rounded-xl overflow-hidden bg-surface-container-lowest aspect-video shadow-lg">
            <video
              ref={(el) => setVideoElement(el)}
              key={video._id}
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              controlsList="nodownload"
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Metadata */}
          <div className="mt-md md:mt-lg flex flex-col gap-md">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">{video.title}</h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              {/* Channel info */}
              <div className="flex items-center gap-md">
                <Link to={owner.username ? `/channel/${owner.username}` : "#"} className="shrink-0">
                  <Avatar src={owner.avatar} name={owner.fullName} size={48} className="border border-surface-container-highest" />
                </Link>
                <div className="flex flex-col mr-md">
                  <Link
                    to={owner.username ? `/channel/${owner.username}` : "#"}
                    className="font-title-md text-on-surface font-bold leading-tight flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {owner.fullName}
                    <BadgeCheck className="size-4 text-surface-variant" aria-hidden="true" />
                  </Link>
                  <span className="font-meta-sm text-on-surface-variant">
                    {formatCount(channel?.subscribersCount || 0)} subscribers
                  </span>
                </div>
                {!isOwnVideo && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing || !channel}
                    className={`font-title-md px-lg py-sm rounded-full transition-colors active:scale-95 shadow-md disabled:opacity-60 ${
                      channel?.isSubscribed
                        ? "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                        : "bg-primary text-on-primary hover:bg-primary-container"
                    }`}
                  >
                    {channel?.isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-sm overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                <div className="flex bg-surface-container-high rounded-full overflow-hidden shrink-0">
                  <button
                    onClick={handleLike}
                    disabled={likePending}
                    className="flex items-center gap-xs px-md py-sm hover:bg-surface-container-highest transition-colors text-on-surface border-r border-surface-container disabled:opacity-60"
                    aria-pressed={liked}
                  >
                    <ThumbsUp className={`size-5 ${liked ? "fill-primary text-primary" : ""}`} aria-hidden="true" />
                    <span className="font-meta-sm font-bold">{liked ? "Liked" : "Like"}</span>
                  </button>
                  <button
                    className="flex items-center px-md py-sm hover:bg-surface-container-highest transition-colors text-on-surface"
                    aria-label="Dislike"
                    title="Dislike"
                  >
                    <ThumbsDown className="size-5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-xs px-md py-sm bg-surface-container-high hover:bg-surface-container-highest rounded-full text-on-surface transition-colors shrink-0 font-meta-sm font-bold"
                >
                  <Share2 className="size-5" aria-hidden="true" /> Share
                </button>
                <a
                  href={video.videoFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-xs px-md py-sm bg-surface-container-high hover:bg-surface-container-highest rounded-full text-on-surface transition-colors shrink-0 font-meta-sm font-bold"
                >
                  <Download className="size-5" aria-hidden="true" /> Download
                </a>
              </div>
            </div>

            {/* Description */}
            <div
              className="bg-surface-container-high rounded-xl p-md mt-sm cursor-pointer"
              onClick={() => setDescExpanded((v) => !v)}
            >
              <div className="flex flex-wrap items-center gap-md font-meta-sm font-bold text-on-surface mb-2">
                <span>{Number(video.views || 0).toLocaleString()} views</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>
              <p className={`font-body-md text-on-surface whitespace-pre-line ${descExpanded ? "" : "line-clamp-2"}`}>
                {video.description}
              </p>
              <span className="font-meta-sm font-bold text-on-surface mt-2 block">
                {descExpanded ? "Show less" : "Show more"}
              </span>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-xl pb-xl">
            <h2 className="font-title-md font-bold text-on-surface mb-lg">
              {commentCount.toLocaleString()} {commentCount === 1 ? "Comment" : "Comments"}
            </h2>

            <form onSubmit={handleAddComment} className="flex gap-md mb-xl">
              <Avatar src={currentUser?.avatar} name={currentUser?.fullName} size={40} className="shrink-0" />
              <div className="flex-1 flex items-end gap-sm border-b border-surface-container-highest focus-within:border-on-surface transition-colors pb-2">
                <input
                  className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder-on-surface-variant p-0 font-body-md"
                  placeholder="Add a comment..."
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || postingComment}
                  className="p-1.5 rounded-full text-primary hover:bg-surface-container-high transition-colors disabled:opacity-40 shrink-0"
                  aria-label="Post comment"
                >
                  {postingComment ? <Spinner className="size-5" /> : <Send className="size-5" aria-hidden="true" />}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-lg">
              {comments.length === 0 && (
                <p className="font-body-md text-on-surface-variant">Be the first to comment.</p>
              )}
              {comments.map((c) => (
                <div key={c._id} className="flex gap-md group">
                  <Avatar src={c.owner?.avatar} name={c.owner?.fullName} size={40} className="shrink-0" />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-meta-sm font-bold text-on-surface">
                        @{c.owner?.username || "user"}
                      </span>
                      <span className="font-label-xs text-on-surface-variant">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="font-body-md text-on-surface break-words">{c.content}</p>
                  </div>
                  {currentUser && c.owner?._id === currentUser._id && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related videos */}
        <aside className="w-full xl:w-[400px] shrink-0 flex flex-col gap-md pb-xl">
          <h2 className="font-title-md font-bold text-on-surface">Up next</h2>
          <div className="flex flex-col gap-sm">
            {related.map((v) => (
              <Link key={v._id} to={`/watch/${v._id}`} className="flex gap-sm group">
                <div className="relative w-40 h-[90px] rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white font-label-xs px-1 rounded">
                    {formatDuration(v.duration)}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0 py-1">
                  <h3 className="font-meta-sm font-bold text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  <span className="font-label-xs text-on-surface-variant mt-1 block truncate">{v.owner?.fullName}</span>
                  <span className="font-label-xs text-on-surface-variant block">
                    {formatViews(v.views)} • {timeAgo(v.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
            {related.length === 0 && (
              <p className="font-meta-sm text-on-surface-variant">No related videos.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default WatchVideo;
