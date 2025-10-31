import { create } from "zustand";

// No persistence - user data fetched from backend on each session
const useAuthStore = create((set) => ({
  user: null,
  isLoading: true, // Track if we're checking authentication
  login: (user) => set({ user, isLoading: false }),
  logout: () => set({ user: null, isLoading: false }),
  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
