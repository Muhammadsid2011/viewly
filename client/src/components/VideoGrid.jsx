import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import api from '../api/axios';

function VideoGrid() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get("/api/videos")
      .then(res => setVideos(res.data.data.docs))
      .catch(err => console.error('Failed to fetch videos:', err));
  }, []);

  return (
    <div className="p-4 md:p-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
      {videos.map((video) => (
        <VideoCard key={video._id} {...video} />
      ))}
    </div>
  );
}

export default VideoGrid;