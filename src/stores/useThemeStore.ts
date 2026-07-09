import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Default to light mode fallback
      theme: "light",

      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        
        // Directly manipulate the DOM root for Tailwind v4
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        set({ theme: nextTheme });
      },

      initTheme: () => {
        const savedTheme = get().theme;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        // Determine theme based on saved preference or system settings
        const activeTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        if (activeTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        set({ theme: activeTheme });
      },
    }),
    {
      name: "momentum-theme-storage", // Unique key for localStorage persistence
    }
  )
);