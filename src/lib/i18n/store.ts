"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "vi";

type I18nState = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: "vi", // ✅ mặc định tiếng Việt
      setLang: (l) => {
        // update <html lang="">
        if (typeof document !== "undefined") {
          document.documentElement.lang = l;
        }
        set({ lang: l });
      },
    }),
    { name: "app-lang" }
  )
);
