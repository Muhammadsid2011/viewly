import api from "./axios";

// GET /api/dashboard/stats — auth. Returns { success, message, data: {
// totalVideos, totalViews, totalSubscribers, totalLikes } } for the logged-in creator.
export const getDashboardStats = async () => {
  const res = await api.get("/api/dashboard/stats");
  return res.data;
};

// GET /api/dashboard/videos — auth, paginated. Returns { success, message, data: {
// videos, pagination: { page, limit, total, totalPages } } }. Includes unpublished videos.
export const getDashboardVideos = async (params = {}) => {
  const res = await api.get("/api/dashboard/videos", { params });
  return res.data;
};
