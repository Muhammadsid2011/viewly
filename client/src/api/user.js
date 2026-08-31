import api from "./axios";

// GET /api/users/channel/:username — auth. Returns { success, data: channel } where
// channel = { _id, fullName, username, subscribersCount, channelsSubscribedToCount,
// isSubscribed, avatar, coverImage, email }.
export const getUserChannel = async (username) => {
  const res = await api.get(`/api/users/channel/${username}`);
  return res.data;
};

// GET /api/users/watch-history — auth. Returns { success, data: [videos] }.
export const getWatchHistory = async () => {
  const res = await api.get("/api/users/watch-history");
  return res.data;
};

// PATCH /api/users/watch-history/:videoId — auth. Add video to watch history.
export const addToWatchHistory = async (videoId) => {
  const res = await api.patch(`/api/users/watch-history/${videoId}`);
  return res.data;
};

// PATCH /api/users/update-user-profile — auth. Body: { username?, email? }.
export const updateProfile = async (data) => {
  const res = await api.patch("/api/users/update-user-profile", data);
  return res.data;
};

// PATCH /api/users/update-user-avatar — auth, multipart (avatar).
export const updateAvatar = async (formData) => {
  const res = await api.patch("/api/users/update-user-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// PATCH /api/users/update-user-cover-image — auth, multipart (coverImage).
export const updateCoverImage = async (formData) => {
  const res = await api.patch("/api/users/update-user-cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
