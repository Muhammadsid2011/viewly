import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { formatDuration, formatViews, timeAgo } from "../utils/format";

function VideoCard({ _id, thumbnail, duration, title, owner, views, createdAt }) {
  const channelHref = owner?.username ? `/channel/${owner.username}` : null;

  return (
    <article className="video-card-hover group flex flex-col gap-sm">
      <Link
        to={`/watch/${_id}`}
        className="relative aspect-video rounded-lg overflow-hidden bg-surface-container-high block"
      >
        <img
          className="w-full h-full object-cover video-thumbnail transition-transform duration-300"
          src={thumbnail}
          alt={title}
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white font-label-xs px-1.5 py-0.5 rounded">
          {formatDuration(duration)}
        </span>
      </Link>
      <div className="flex gap-3">
        {channelHref ? (
          <Link to={channelHref} className="flex-shrink-0 mt-1">
            <Avatar src={owner?.avatar} name={owner?.fullName} size={36} />
          </Link>
        ) : (
          <Avatar src={owner?.avatar} name={owner?.fullName} size={36} className="mt-1" />
        )}
        <div className="flex flex-col min-w-0">
          <Link to={`/watch/${_id}`}>
            <h3 className="font-title-md text-on-surface line-clamp-2 leading-tight">{title}</h3>
          </Link>
          {channelHref ? (
            <Link
              to={channelHref}
              className="mt-1 font-meta-sm text-on-surface-variant hover:text-on-surface transition-colors w-fit"
            >
              {owner?.fullName}
            </Link>
          ) : (
            <span className="mt-1 font-meta-sm text-on-surface-variant">{owner?.fullName}</span>
          )}
          <div className="flex items-center gap-1 font-meta-sm text-on-surface-variant">
            <span>{formatViews(views)}</span>
            {createdAt && (
              <>
                <span aria-hidden="true">•</span>
                <span>{timeAgo(createdAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;
