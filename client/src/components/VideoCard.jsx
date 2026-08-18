function VideoCard({ thumbnail, duration, title, owner, views }) {
  return (
    <article className="video-card-hover group cursor-pointer flex flex-col gap-sm">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-container-high">
        <img
          className="w-full h-full object-cover video-thumbnail transition-transform duration-300"
          src={thumbnail}
          alt=""
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white font-label-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <div className="flex gap-3">
        <img
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
          src={owner.avatar}
          alt=""
        />
        <div className="flex flex-col min-w-0">
          <h3 className="font-title-md text-on-surface line-clamp-2 leading-tight sm:line-clamp-1">{title}</h3>
          <div className="mt-1 flex flex-col font-meta-sm text-on-surface-variant sm:flex-row sm:gap-2">
            <span>{owner.fullName}</span>
            <span>{views} views</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;