"use client";

import { create } from "zustand";

export type Flight = {
  id: number;
  img: string;
  from: { top: number; left: number; width: number; height: number };
  to: { top: number; left: number; width: number; height: number };
};

type FlyState = {
  flights: Flight[];
  bump: number;
  push: (f: Omit<Flight, "id">) => void;
  remove: (id: number) => void;
};

export const useFlyStore = create<FlyState>((set) => ({
  flights: [],
  bump: 0,
  push: (f) =>
    set((s) => ({
      flights: [...s.flights, { ...f, id: Date.now() + Math.random() }],
    })),
  remove: (id) =>
    set((s) => ({
      flights: s.flights.filter((fl) => fl.id !== id),
      bump: s.bump + 1,
    })),
}));

let flyTarget: HTMLElement | null = null;

export function setFlyTarget(el: HTMLElement | null) {
  flyTarget = el;
}

export function flyToCart(imgSrc: string, fromEl: HTMLElement) {
  if (!flyTarget) return;
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = flyTarget.getBoundingClientRect();
  if (fromRect.width === 0 || toRect.width === 0) return;

  useFlyStore.getState().push({
    img: imgSrc,
    from: {
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
    },
    to: {
      top: toRect.top,
      left: toRect.left,
      width: toRect.width,
      height: toRect.height,
    },
  });
}
