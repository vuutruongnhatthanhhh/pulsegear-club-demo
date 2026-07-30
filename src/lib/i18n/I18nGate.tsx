"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useI18nStore } from "./store";
import { useCartStore } from "@/lib/cart/store";

const ACCENT = "#FF3C00";

/**
 * Persisted state (language, cart) lives in localStorage, which isn't
 * available during SSR. Rendering immediately would flash defaults before
 * zustand's persist middleware finishes rehydrating. Gate children behind
 * hydration of both stores so the first paint always reflects saved state.
 */
export default function I18nGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const bothHydrated = () =>
      useI18nStore.persist.hasHydrated() && useCartStore.persist.hasHydrated();

    if (bothHydrated()) {
      setHydrated(true);
      return;
    }

    const check = () => {
      if (bothHydrated()) setHydrated(true);
    };
    const unsub1 = useI18nStore.persist.onFinishHydration(check);
    const unsub2 = useCartStore.persist.onFinishHydration(check);
    return () => {
      unsub1();
      unsub2();
    };
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
