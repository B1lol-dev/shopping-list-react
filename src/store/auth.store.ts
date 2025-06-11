import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
  token: string;
  setToken: (value: string) => void;
  removeToken: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      token: "",
      setToken: (value: string) => set(() => ({ token: value })),
      removeToken: () => set(() => ({ token: "" })),
    }),
    {
      name: "auth-store",
    }
  )
);
