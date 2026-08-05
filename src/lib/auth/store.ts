"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthState = {
  user: User | null;
  loading: boolean;
};

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: true,
}));

// Session lives in Supabase's own localStorage-backed store — this just
// mirrors it into Zustand so components can react to auth changes.
if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({ user: data.session?.user ?? null, loading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({ user: session?.user ?? null, loading: false });
  });
}
