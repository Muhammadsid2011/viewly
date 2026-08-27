import api from "./axios";

// POST /api/likes/video/:videoId — auth. Toggles. Returns { success, message, data: { liked } }.
export const toggleVideoLike = async (videoId) => {
  const res = await api.post(`/api/likes/video/${videoId}`);
  return res.data;
};

// POST /api/likes/comment/:commentId — auth. Returns { success, message, data: { liked } }.
export const toggleCommentLike = async (commentId) => {
  const res = await api.post(`/api/likes/comment/${commentId}`);
  return res.data;
};

// GET /api/likes/videos — auth, paginated. Returns { success, message, data: <paginate of videos> }.
export const getLikedVideos = async (params = {}) => {
  const res = await api.get("/api/likes/videos", { params });
  return res.data;
};
