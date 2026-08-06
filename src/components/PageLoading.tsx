"use client";

import { Loader2 } from "lucide-react";

const ACCENT = "#FF3C00";

/** Themed loading state for client pages that fetch their own data (avoids a white flash). */
export default function PageLoading() {
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
