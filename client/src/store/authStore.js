import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthLoading: true,

  setUser: (user) => {
    set({
      user: user
        ? {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            coverImage: user.coverImage,
          }
        : null,
    });
  },

  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  logout: () => {
    set({
      user: null,
    });
  },
}));

export default useAuthStore;
