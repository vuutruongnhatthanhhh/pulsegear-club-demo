"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string;
  category: string;
  id: number;
  slug: string;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string;
  size?: string;
  color?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.key === item.key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === item.key ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "app-cart" }
  )
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty, 0);

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0);
