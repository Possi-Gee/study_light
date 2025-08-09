
import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
  isUpdating: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUpdating: (isUpdating: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isUpdating: false,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setUpdating: (isUpdating) => set({ isUpdating }),
}));
