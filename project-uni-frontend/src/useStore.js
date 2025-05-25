import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })), // <- add this
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
