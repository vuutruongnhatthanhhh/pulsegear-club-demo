"use client";

import { supabase } from "@/lib/supabaseClient";
import type { Lang } from "@/lib/i18n/store";

// Keys are either raw Supabase Auth error messages (signIn/Google, still handled
// client-side by supabase-js) or short codes returned by our own /api/auth/*
// routes (register/forgot-password, which bypass Supabase's built-in mailer).
const KNOWN_ERRORS: Record<string, { vi: string; en: string }> = {
  "Invalid login credentials": {
    vi: "Email hoặc mật khẩu không đúng.",
    en: "Incorrect email or password.",
  },
  "Email not confirmed": {
    vi: "Vui lòng xác nhận email trước khi đăng nhập.",
    en: "Please confirm your email before signing in.",
  },
  already_registered: {
    vi: "Email này đã được đăng ký.",
    en: "This email is already registered.",
  },
  invalid_input: {
    vi: "Thông tin không hợp lệ, vui lòng kiểm tra lại.",
    en: "Invalid information, please check and try again.",
  },
  rate_limited: {
    vi: "Bạn đã thử quá nhiều lần, vui lòng thử lại sau ít phút.",
    en: "Too many attempts — please try again in a few minutes.",
  },
  send_failed: {
    vi: "Không thể gửi email lúc này, vui lòng thử lại sau.",
    en: "Couldn't send the email right now, please try again later.",
  },
  invalid_current_password: {
    vi: "Mật khẩu hiện tại không đúng.",
    en: "Current password is incorrect.",
  },
};

export function translateAuthError(messageOrCode: string, lang: Lang): string {
  const known = KNOWN_ERRORS[messageOrCode];
  if (known) return known[lang];
  return lang === "vi"
    ? "Đã có lỗi xảy ra, vui lòng thử lại."
    : "Something went wrong, please try again.";
}

// Bypasses supabase.auth.signUp() entirely — that would trigger Supabase's own
// confirmation email. Instead /api/auth/register creates the user via the admin
// API (which never auto-sends) and emails the confirmation link ourselves.
export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (res.ok) return { error: null };
  const body = await res.json().catch(() => ({}));
  return { error: body.error ?? "server_error" };
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/` },
  });
  return { error };
}

// Bypasses supabase.auth.resetPasswordForEmail() — same reasoning as signUpWithEmail.
export async function resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (res.ok) return { error: null };
  const body = await res.json().catch(() => ({}));
  return { error: body.error ?? "server_error" };
}

export async function signOut() {
  await supabase.auth.signOut();
}

// Verifies the current password by attempting a real sign-in with it (Supabase
// has no separate "verify password" call) before applying the new one.
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "server_error" };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "invalid_current_password" };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error ? "server_error" : null };
}
