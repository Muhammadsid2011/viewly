import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import Spinner from "./Spinner";
import { getVideos } from "../api/video";
import { getErrorMessage } from "../utils/format";

const GRID_CLASS =
  "p-4 md:p-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md";
const PAGE_SIZE = 12;

function VideoGrid({ query = "", userId, emptyMessage = "No videos found." }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getVideos({ query, userId, page: 1, limit: PAGE_SIZE });
        if (!active) return;
        const data = res.data || {};
        setVideos(data.docs || []);
        setPage(1);
        setHasNext(Boolean(data.hasNextPage));
      } catch (err) {
        if (active) setError(getErrorMessage(err, "Failed to load videos."));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [query, userId]);

  const loadMore = () => {
    const next = page + 1;
    setLoadingMore(true);
    getVideos({ query, userId, page: next, limit: PAGE_SIZE })
      .then((res) => {
        const data = res.data || {};
        setVideos((prev) => [...prev, ...(data.docs || [])]);
        setPage(next);
        setHasNext(Boolean(data.hasNextPage));
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  if (loading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-lg flex flex-col items-center justify-center gap-md text-center min-h-[40vh]">
        <p className="font-body-md text-on-surface-variant">{error}</p>
        <button
          onClick={() => {
            setPage(1);
            setError("");
            setLoading(true);
            getVideos({ query, userId, page: 1, limit: PAGE_SIZE })
              .then((res) => {
                const data = res.data || {};
                setVideos(data.docs || []);
                setHasNext(Boolean(data.hasNextPage));
              })
              .catch((err) => setError(getErrorMessage(err, "Failed to load videos.")))
              .finally(() => setLoading(false));
          }}
          className="px-lg py-2 rounded-full bg-primary text-on-primary font-title-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="p-lg flex items-center justify-center min-h-[40vh]">
        <p className="font-body-md text-on-surface-variant text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={GRID_CLASS}>
        {videos.map((video) => (
          <VideoCard key={video._id} {...video} />
        ))}
      </div>
      {hasNext && (
        <div className="flex justify-center pb-xl">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-lg py-2.5 rounded-full bg-surface-container-high text-on-surface font-title-md hover:bg-surface-container-highest transition-colors flex items-center gap-sm disabled:opacity-60"
          >
            {loadingMore && <Spinner className="size-4" />}
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}

export default VideoGrid;
