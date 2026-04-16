"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-[1000] group"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A5A88 100%)`,
          border: `2px solid ${ACCENT}`,
        }}
      >
        <ChevronUp
          size={20}
          className="text-white transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      </div>

      {/* glow */}
      <span
        className="absolute inset-0 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-60"
        style={{ backgroundColor: ACCENT }}
      />
    </button>
  );
}
