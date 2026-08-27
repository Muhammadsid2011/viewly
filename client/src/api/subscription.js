import api from "./axios";

// POST /api/subscription/toggle/:channelId — auth. Responds 204 (no body).
export const toggleSubscription = async (channelId) => {
  await api.post(`/api/subscription/toggle/${channelId}`);
};

// GET /api/subscription/count-subscribers/:channelId — auth. Returns { count }.
export const getSubscribersCount = async (channelId) => {
  const res = await api.get(`/api/subscription/count-subscribers/${channelId}`);
  return res.data;
};

// GET /api/subscription/count-channels/:subscriberId — auth. Returns { count }.
export const getSubscribedChannelsCount = async (subscriberId) => {
  const res = await api.get(`/api/subscription/count-channels/${subscriberId}`);
  return res.data;
};
