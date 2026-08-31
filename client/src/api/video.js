import api from "./axios";

// GET /api/videos — public, paginated. Returns { success, message, data: <paginate> }
// where paginate = { docs, totalDocs, limit, page, totalPages, hasNextPage, ... }.
// Supported params: query, userId, page, limit, sortBy, sortType.
export const getVideos = async (params = {}) => {
  const res = await api.get("/api/videos", { params });
  return res.data;
};

// GET /api/videos/:id — auth required. Returns { success, message, data: video }.
export const getVideoById = async (id) => {
  const res = await api.get(`/api/videos/${id}`);
  return res.data;
};

// POST /api/videos/publish — auth, multipart (videoFile + thumbnail required, title, description, isPublished).
export const publishVideo = async (formData, onUploadProgress) => {
  const res = await api.post("/api/videos/publish", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data;
};

// PATCH /api/videos/:id — auth, multipart (optional thumbnail). Requires title + description.
export const updateVideo = async (id, formData) => {
  const res = await api.patch(`/api/videos/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE /api/videos/:id — auth.
export const deleteVideo = async (id) => {
  const res = await api.delete(`/api/videos/${id}`);
  return res.data;
};

// PATCH /api/videos/toggle-publish-status/:id — auth.
export const togglePublishStatus = async (id) => {
  const res = await api.patch(`/api/videos/toggle-publish-status/${id}`);
  return res.data;
};

// PATCH /api/videos/increment-views/:id — public.
export const incrementViews = async (id) => {
  const res = await api.patch(`/api/videos/increment-views/${id}`);
  return res.data;
};
