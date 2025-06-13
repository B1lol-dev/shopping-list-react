import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TThemes = "dark" | "light";
interface IThemeStore {
  theme: TThemes;
  setTheme: (theme: TThemes) => void;
}

export const useThemeStore = create<IThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: TThemes) =>
        set({
          theme,
        }),
    }),
    {
      name: "theme-store",
    }
  )
);
