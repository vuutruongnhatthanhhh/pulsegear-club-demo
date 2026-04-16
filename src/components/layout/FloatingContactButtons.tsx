// src/components/layout/FloatingContactButtons.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, X } from "lucide-react";
import { SiZalo } from "react-icons/si";
import { FaFacebookMessenger } from "react-icons/fa";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type Item = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    key: "map",
    label: "Bản đồ",
    href: "https://maps.app.goo.gl/UpXWFsTyUTwGTup5A",
    icon: <MapPin size={18} />,
  },
  {
    key: "zalo",
    label: "Zalo",
    href: "https://zalo.me/0908228788",
    icon: <SiZalo size={18} />,
  },
  {
    key: "messenger",
    label: "Messenger",
    href: "https://www.messenger.com/t/335067639959554/",
    icon: <FaFacebookMessenger size={18} />,
  },
  {
    key: "phone",
    label: "Gọi điện",
    href: "tel:0908228788",
    icon: <Phone size={18} />,
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:info@daipartners.com.vn",
    icon: <Mail size={18} />,
  },
];

function FabShell({
  children,
  as = "button",
  href,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full";
  const inner =
    "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:-translate-y-1";

  const style = {
    background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A5A88 100%)`,
    border: `2px solid ${ACCENT}`,
  } as const;

  const glowStyle = { backgroundColor: ACCENT } as const;

  const content = (
    <>
      <div className={inner} style={style}>
        <span className="text-white">{children}</span>
      </div>
      <span
        className="absolute inset-0 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-60"
        style={glowStyle}
      />
    </>
  );

  if (as === "a") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${className}`}>
      {content}
    </button>
  );
}

export default function FloatingContactButtons() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile (< 768px = Tailwind "md")
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Khôi phục trạng thái toggle trên mobile
  useEffect(() => {
    if (!isMobile) return;
    try {
      if (localStorage.getItem("contact_dock_open") === "1") setOpen(true);
    } catch {}
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    try {
      localStorage.setItem("contact_dock_open", open ? "1" : "0");
    } catch {}
  }, [open, isMobile]);

  // Click outside -> đóng (chỉ mobile)
  useEffect(() => {
    if (!isMobile) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!open) return;
      if (e.target instanceof Node && !rootRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, isMobile]);

  // ESC -> đóng (chỉ mobile)
  useEffect(() => {
    if (!isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobile]);

  const showItems = !isMobile || open;

  return (
    <div ref={rootRef} className="fixed bottom-20 right-5 z-[1000]">
      <div className="flex flex-col items-end gap-3">
        {ITEMS.map((item, idx) => {
          const delay = isMobile ? 40 * idx : 0;
          return (
            <div
              key={item.key}
              className="relative"
              style={{
                transition: "transform 260ms ease, opacity 200ms ease",
                transitionDelay: showItems ? `${delay}ms` : "0ms",
                transform: showItems
                  ? "translateY(0) scale(1)"
                  : "translateY(10px) scale(0.9)",
                opacity: showItems ? 1 : 0,
                pointerEvents: showItems ? "auto" : "none",
              }}
            >
              <FabShell as="a" href={item.href}>
                {item.icon}
              </FabShell>
            </div>
          );
        })}

        {/* Nút toggle — chỉ hiện trên mobile */}
        {isMobile && (
          <FabShell onClick={() => setOpen((v) => !v)} className="mt-1">
            {open ? <X size={18} /> : <MessageCircle size={18} />}
          </FabShell>
        )}
      </div>
    </div>
  );
}
