"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import type { Stat as StatRow } from "@/services/StatService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type StatItem = {
  key: string;
  value: number; // số để đếm tới
  suffix?: string; // +, %+
  label: { vi: string; en: string };
};

function safeLang(lang: Lang) {
  return lang === "vi" || lang === "en" ? lang : ("vi" as Lang);
}

function formatWithThousands(n: number) {
  return n.toLocaleString("en-US");
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25, ...options },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function AnimatedNumber({
  to,
  start,
  duration = 1100,
  formatter,
}: {
  to: number;
  start: boolean;
  duration?: number;
  formatter?: (n: number) => string;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = easeOutCubic(p);
      const next = Math.round(to * eased);
      setVal(next);

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);

  return <>{formatter ? formatter(val) : val}</>;
}

function toNumberSafe(v: any) {
  // phòng trường hợp bigint trả về dạng string
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(String(v));
  return Number.isFinite(n) ? n : 0;
}

export default function StatsCounterStrip({
  stat,
}: {
  // anh có thể truyền null nếu DB chưa có dòng nào
  stat?: StatRow | null;
}) {
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);

  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.35 });

  const stats = useMemo<StatItem[]>(() => {
    const customer = toNumberSafe(stat?.customer);
    const satisfied = toNumberSafe(stat?.satisfied);
    const year = toNumberSafe(stat?.year);
    const partners = toNumberSafe(stat?.partners);

    return [
      {
        key: "customers",
        value: customer,
        suffix: "+",
        label: { vi: "Khách hàng", en: "Customers" },
      },
      {
        key: "satisfaction",
        value: satisfied,
        suffix: "%+",
        label: { vi: "Mức độ hài lòng", en: "Satisfaction" },
      },
      {
        key: "years",
        value: year,
        suffix: "+",
        label: { vi: "Năm kinh nghiệm", en: "Years of experience" },
      },
      {
        key: "partners",
        value: partners,
        suffix: "+",
        label: { vi: "Chuyên gia, đối tác", en: "Experts & partners" },
      },
    ];
  }, [stat]);

  return (
    <section className="w-full">
      <div
        ref={ref}
        className="w-full my-14"
        style={{
          background: `linear-gradient(90deg, ${PRIMARY} 0%, #0A5A8A 50%, ${PRIMARY} 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4 sm:gap-y-0">
            {stats.map((s, idx) => (
              <div
                key={s.key}
                className={[
                  "relative flex flex-col items-center justify-center text-center",
                  "px-3",
                ].join(" ")}
              >
                {/* dotted divider (desktop) */}
                {idx !== 0 && (
                  <div className="absolute left-0 top-1/2 hidden h-12 -translate-y-1/2 sm:block">
                    <div
                      className="h-full w-[2px]"
                      style={{
                        background:
                          "repeating-linear-gradient(to bottom, rgba(255,255,255,.65) 0 2px, rgba(255,255,255,0) 2px 6px)",
                      }}
                    />
                  </div>
                )}

                {/* number */}
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-black tracking-wide text-white md:text-5xl">
                    <AnimatedNumber
                      to={s.value}
                      start={inView}
                      duration={1200}
                      formatter={formatWithThousands}
                    />
                  </div>
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: ACCENT }}
                  >
                    {s.suffix ?? ""}
                  </div>
                </div>

                {/* label */}
                <div className="mt-2 text-sm font-semibold text-white/90">
                  {L === "vi" ? s.label.vi : s.label.en}
                </div>
              </div>
            ))}
          </div>

          {/* subtle bottom shine */}
          <div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(231,191,100,.75) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
