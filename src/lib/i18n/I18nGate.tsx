"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useI18nStore } from "./store";

const ACCENT = "#FF3C00";

/**
 * The persisted language lives in localStorage, which isn't available
 * during SSR. Rendering immediately would flash the default language
 * (en) before zustand's persist middleware finishes rehydrating from
 * localStorage. Gate children behind hydration so the first paint is
 * always the correct, persisted language.
 */
export default function I18nGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useI18nStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useI18nStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <img
          src="/logo.png"
          alt="Pulsegear.Club"
          className="h-12 w-12 object-contain"
        />
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  return <>{children}</>;
}
