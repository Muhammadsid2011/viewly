function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-sm animate-pulse">
      <div className="aspect-video rounded-lg bg-surface-container-high" />
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-surface-container-high flex-shrink-0 mt-1" />
        <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1">
          <div className="h-3.5 bg-surface-container-high rounded w-full" />
          <div className="h-3 bg-surface-container-high rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default VideoCardSkeleton;
