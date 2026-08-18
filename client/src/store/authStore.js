import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  setUser: (user) => {
    set({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
      },
    });
  },

  logout: () => {
    set({
      user: null,
    });
  },
}));

export default useAuthStore;