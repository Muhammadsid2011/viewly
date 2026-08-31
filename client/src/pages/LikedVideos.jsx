import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { VideoCard, VideoCardSkeleton } from "../components";
import { getLikedVideos } from "../api/like";
import { getErrorMessage } from "../utils/format";

const GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md";

function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLikedVideos({ page: 1, limit: 24 })
      .then((res) => {
        if (active) setVideos(res.data?.docs || []);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Failed to load liked videos."));
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
        <ThumbsUp className="size-6 text-primary" aria-hidden="true" />
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Liked Videos</h1>
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
          You haven’t liked any videos yet.
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

export default LikedVideos;
