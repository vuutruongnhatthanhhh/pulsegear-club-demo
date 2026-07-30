"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart/store";
import { setFlyTarget, useFlyStore } from "@/lib/cart/flyStore";

const PRIMARY = "#0A0A0A";
const ACCENT = "#FF3C00";

export default function FloatingCartButton() {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);
  const bump = useFlyStore((s) => s.bump);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setFlyTarget(linkRef.current);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: count > 0 ? 1 : 0,
        scale: count > 0 ? 1 : 0.5,
        y: count > 0 ? 0 : 20,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="fixed bottom-[76px] right-5 z-[1000]"
      style={{ pointerEvents: count > 0 ? "auto" : "none" }}
    >
      <Link
        ref={linkRef}
        href="/gio-hang"
        aria-label="Cart"
        className="group relative block"
      >
        <motion.div
          key={bump}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            background: `linear-gradient(135deg, #1A1A1A 0%, ${PRIMARY} 100%)`,
            border: `2px solid ${ACCENT}`,
          }}
        >
          <ShoppingBag size={18} className="text-white" />
          <span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-black"
            style={{ backgroundColor: ACCENT }}
          >
            {count}
          </span>
        </motion.div>

        <span
          className="absolute inset-0 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          style={{ backgroundColor: ACCENT }}
        />
      </Link>
    </motion.div>
  );
}
