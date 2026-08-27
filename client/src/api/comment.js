import api from "./axios";

// GET /api/comments/:videoId — auth, paginated. Returns { message, data: <paginate> }.
export const getComments = async (videoId, params = {}) => {
  const res = await api.get(`/api/comments/${videoId}`, { params });
  return res.data;
};

// POST /api/comments — auth. Body: { content, video }. Returns { message, data: comment }.
// Note: the returned comment's `owner` is NOT populated (just the id), so the UI
// should render newly-added comments using the logged-in user from the store.
export const addComment = async ({ content, video }) => {
  const res = await api.post("/api/comments", { content, video });
  return res.data;
};

// PATCH /api/comments/update/:commentId — auth. Body: { content }.
export const updateComment = async (commentId, content) => {
  const res = await api.patch(`/api/comments/update/${commentId}`, { content });
  return res.data;
};

// DELETE /api/comments/delete/:commentId — auth. Responds 204 (no body).
export const deleteComment = async (commentId) => {
  await api.delete(`/api/comments/delete/${commentId}`);
};
