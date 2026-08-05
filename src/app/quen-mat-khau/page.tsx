"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import { resetPasswordForEmail, translateAuthError } from "@/lib/auth/actions";

const C = {
  bg: "#0A0A0A",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  eyebrow: { vi: "QUÊN MẬT KHẨU", en: "FORGOT PASSWORD" },
  title1: { vi: "ĐẶT LẠI", en: "RESET YOUR" },
  title2: { vi: "MẬT KHẨU", en: "PASSWORD" },
  sub: {
    vi: "Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.",
    en: "Enter your registered email and we'll send you a reset link.",
  },
  email: { vi: "Email", en: "Email" },
  submit: { vi: "GỬI LIÊN KẾT", en: "SEND RESET LINK" },
  submitting: { vi: "ĐANG GỬI...", en: "SENDING..." },
  backToLogin: { vi: "Quay lại đăng nhập", en: "Back to sign in" },
  success: {
    vi: "Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam/Thư rác).",
    en: "Reset link sent. Please check your inbox (and Spam/Junk folder).",
  },
};

export default function ForgotPasswordPage() {
  const lang = useI18nStore((s) => s.lang);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await resetPasswordForEmail(email);
    setSubmitting(false);

    if (error) {
      toast.error(translateAuthError(error, lang));
      return;
    }

    toast.success(T.success[lang]);
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
            {T.title1[lang]}{" "}
            <span style={{ color: C.accent }}>{T.title2[lang]}</span>
          </h1>
          <p
            className="mx-auto mt-3 max-w-xs text-center text-[14px] leading-relaxed"
            style={{ color: C.muted }}
          >
            {T.sub[lang]}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.muted }}
              >
                {T.email[lang]}
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                style={{
                  border: `1px solid ${C.border}`,
                  backgroundColor: "#141414",
                }}
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

          <Link
            href="/dang-nhap"
            className="mt-6 flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:text-white"
            style={{ color: C.muted }}
          >
            <ArrowLeft size={14} />
            {T.backToLogin[lang]}
          </Link>
        </div>
      </div>
    </div>
  );
}
