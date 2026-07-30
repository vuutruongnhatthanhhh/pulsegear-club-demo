"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFlyStore } from "@/lib/cart/flyStore";

export default function FlyToCartLayer() {
  const flights = useFlyStore((s) => s.flights);
  const remove = useFlyStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2000]">
      <AnimatePresence>
        {flights.map((f) => (
          <motion.img
            key={f.id}
            src={f.img}
            initial={{
              top: f.from.top,
              left: f.from.left,
              width: f.from.width,
              height: f.from.height,
              opacity: 1,
              borderRadius: 8,
            }}
            animate={{
              top: f.to.top + f.to.height / 2 - 12,
              left: f.to.left + f.to.width / 2 - 12,
              width: 24,
              height: 24,
              opacity: 0.5,
              borderRadius: 999,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.32, 0, 0.67, 0] }}
            onAnimationComplete={() => remove(f.id)}
            style={{ position: "fixed", objectFit: "cover" }}
            className="shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
