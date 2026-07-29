"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";

const C = {
  bg: "#0A0A0A",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
    />
  </svg>
);

const T = {
  eyebrow: { vi: "ĐĂNG KÝ", en: "SIGN UP" },
  title1: { vi: "GIA NHẬP", en: "JOIN THE" },
  title2: { vi: "CỘNG ĐỒNG", en: "CLUB" },
  sub: {
    vi: "Tạo tài khoản để mua sắm nhanh hơn và nhận ưu đãi độc quyền.",
    en: "Create an account for faster checkout and exclusive perks.",
  },
  google: { vi: "Đăng ký với Google", en: "Continue with Google" },
  or: { vi: "HOẶC", en: "OR" },
  fullName: { vi: "Họ và tên", en: "Full name" },
  email: { vi: "Email", en: "Email" },
  password: { vi: "Mật khẩu", en: "Password" },
  confirmPassword: { vi: "Xác nhận mật khẩu", en: "Confirm password" },
  submit: { vi: "TẠO TÀI KHOẢN", en: "CREATE ACCOUNT" },
  haveAccount: { vi: "Đã có tài khoản?", en: "Already have an account?" },
  login: { vi: "Đăng nhập", en: "Sign in" },
};

export default function RegisterPage() {
  const lang = useI18nStore((s) => s.lang);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

          <button
            type="button"
            className="mt-7 flex w-full items-center justify-center gap-3 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/5"
            style={{ border: `1px solid ${C.border}` }}
          >
            <GoogleIcon size={16} />
            {T.google[lang]}
          </button>

          <div className="my-6 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: C.border }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.2em]"
              style={{ color: C.muted }}
            >
              {T.or[lang]}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: C.border }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.muted }}
              >
                {T.fullName[lang]}
              </label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={lang === "vi" ? "Nguyễn Văn A" : "John Doe"}
                className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                style={{
                  border: `1px solid ${C.border}`,
                  backgroundColor: "#141414",
                }}
              />
            </div>

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

            <div>
              <label
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.muted }}
              >
                {T.password[lang]}
              </label>
              <div
                className="flex items-center"
                style={{
                  border: `1px solid ${C.border}`,
                  backgroundColor: "#141414",
                }}
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
                style={{
                  border: `1px solid ${C.border}`,
                  backgroundColor: "#141414",
                }}
              />
            </div>

            <button
              type="submit"
              className="group relative mt-2 flex w-full items-center justify-center overflow-hidden py-3.5 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
              style={{ backgroundColor: C.accent }}
            >
              <span className="relative z-10">{T.submit[lang]}</span>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </form>

          <p
            className="mt-6 text-center text-[13px]"
            style={{ color: C.muted }}
          >
            {T.haveAccount[lang]}{" "}
            <Link
              href="/dang-nhap"
              className="font-bold text-white underline underline-offset-4 transition-colors hover:text-white/80"
            >
              {T.login[lang]}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
