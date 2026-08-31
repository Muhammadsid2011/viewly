import { useEffect, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { VideoCard, VideoCardSkeleton } from "../components";
import { getWatchHistory } from "../api/user";
import { getErrorMessage } from "../utils/format";

const GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md";

function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getWatchHistory()
      .then((res) => {
        if (active) setVideos(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Failed to load watch history."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-4 md:px-lg py-4 md:py-lg">
      <div className="flex items-center gap-sm mb-lg">
        <HistoryIcon className="size-6 text-primary" aria-hidden="true" />
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Watch History</h1>
      </div>

      {loading ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="font-body-md text-on-surface-variant text-center py-xl">{error}</p>
      ) : !videos.length ? (
        <p className="font-body-md text-on-surface-variant text-center py-xl">
          Your watch history is empty.
        </p>
      ) : (
        <div className={GRID_CLASS}>
          {videos.map((video) => (
            <VideoCard key={video._id} {...video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
