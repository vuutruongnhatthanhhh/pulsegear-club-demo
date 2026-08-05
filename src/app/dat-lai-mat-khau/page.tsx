"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/lib/auth/store";
import { translateAuthError } from "@/lib/auth/actions";

const C = {
  bg: "#0A0A0A",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  eyebrow: { vi: "ĐẶT LẠI MẬT KHẨU", en: "RESET PASSWORD" },
  title1: { vi: "TẠO MẬT KHẨU", en: "SET A NEW" },
  title2: { vi: "MỚI", en: "PASSWORD" },
  sub: {
    vi: "Nhập mật khẩu mới cho tài khoản của bạn.",
    en: "Enter a new password for your account.",
  },
  invalidLink: {
    vi: "Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.",
    en: "This link is invalid or has expired. Please request a new one.",
  },
  password: { vi: "Mật khẩu mới", en: "New password" },
  confirmPassword: { vi: "Xác nhận mật khẩu", en: "Confirm password" },
  submit: { vi: "ĐẶT LẠI MẬT KHẨU", en: "RESET PASSWORD" },
  submitting: { vi: "ĐANG LƯU...", en: "SAVING..." },
  passwordMismatch: {
    vi: "Mật khẩu xác nhận không khớp.",
    en: "Passwords don't match.",
  },
  success: {
    vi: "Đã đặt lại mật khẩu! Đang chuyển hướng...",
    en: "Password reset! Redirecting...",
  },
  requestNewLink: { vi: "Yêu cầu liên kết mới", en: "Request a new link" },
};

export default function ResetPasswordPage() {
  const lang = useI18nStore((s) => s.lang);
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // The recovery link logs the user in via a special session — if one already
  // exists by the time this page mounts (e.g. fast redirect), treat as valid too.
  useEffect(() => {
    if (!loading && user) setHasRecoverySession(true);
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(T.passwordMismatch[lang]);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error(translateAuthError(error.message, lang));
      return;
    }

    toast.success(T.success[lang]);
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24"
      style={{ backgroundColor: C.bg, color: "#fff" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C.accent}18, transparent 70%)`,
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <img
            src="/logo.png"
            alt="Pulsegear.Club"
            className="h-11 w-11 object-contain"
          />
          <span className="text-sm font-black tracking-[0.1em] text-white">
            PULSEGEAR.CLUB
          </span>
        </Link>

        <div
          className="p-8"
          style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}` }}
        >
          <p
            className="mb-3 text-center text-[12px] font-black tracking-[0.3em] uppercase"
            style={{ color: C.accent }}
          >
            {T.eyebrow[lang]}
          </p>
          <h1 className="text-center text-2xl font-black tracking-[-0.02em] text-white">
            {T.title1[lang]} <span style={{ color: C.accent }}>{T.title2[lang]}</span>
          </h1>
          <p
            className="mx-auto mt-3 max-w-xs text-center text-[14px] leading-relaxed"
            style={{ color: C.muted }}
          >
            {T.sub[lang]}
          </p>

          {!loading && !hasRecoverySession ? (
            <div className="mt-7 space-y-4 text-center">
              <p className="text-[14px]" style={{ color: C.muted }}>
                {T.invalidLink[lang]}
              </p>
              <Link
                href="/quen-mat-khau"
                className="inline-block text-[13px] font-bold text-white underline underline-offset-4 transition-colors hover:text-white/80"
              >
                {T.requestNewLink[lang]}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: C.muted }}
                >
                  {T.password[lang]}
                </label>
                <div
                  className="flex items-center"
                  style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                >
                  <input
                    required
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="px-3 transition-colors hover:text-white"
                    style={{ color: C.muted }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: C.muted }}
                >
                  {T.confirmPassword[lang]}
                </label>
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                  style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center overflow-hidden py-3.5 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: C.accent }}
              >
                <span className="relative z-10">
                  {submitting ? T.submitting[lang] : T.submit[lang]}
                </span>
                <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
