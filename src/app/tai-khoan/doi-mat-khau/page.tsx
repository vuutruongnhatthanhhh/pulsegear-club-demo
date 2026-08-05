"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import { useAuthStore } from "@/lib/auth/store";
import { changePassword, translateAuthError } from "@/lib/auth/actions";

const C = {
  bg: "#0A0A0A",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  eyebrow: { vi: "TÀI KHOẢN", en: "ACCOUNT" },
  title1: { vi: "ĐỔI", en: "CHANGE" },
  title2: { vi: "MẬT KHẨU", en: "PASSWORD" },
  sub: {
    vi: "Nhập mật khẩu hiện tại và mật khẩu mới của bạn.",
    en: "Enter your current password and a new one.",
  },
  loading: { vi: "Đang tải...", en: "Loading..." },
  currentPassword: { vi: "Mật khẩu hiện tại", en: "Current password" },
  newPassword: { vi: "Mật khẩu mới", en: "New password" },
  confirmNewPassword: { vi: "Xác nhận mật khẩu mới", en: "Confirm new password" },
  submit: { vi: "ĐỔI MẬT KHẨU", en: "CHANGE PASSWORD" },
  submitting: { vi: "ĐANG LƯU...", en: "SAVING..." },
  success: { vi: "Đã đổi mật khẩu thành công.", en: "Password changed successfully." },
  mismatch: {
    vi: "Mật khẩu xác nhận không khớp.",
    en: "Passwords don't match.",
  },
  tooShort: {
    vi: "Mật khẩu mới phải có ít nhất 6 ký tự.",
    en: "New password must be at least 6 characters.",
  },
  samePassword: {
    vi: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    en: "New password must be different from the current one.",
  },
  backToAccount: { vi: "Quay lại thông tin cá nhân", en: "Back to account" },
};

export default function DoiMatKhauPage() {
  const lang = useI18nStore((s) => s.lang);
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dang-nhap");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error(T.mismatch[lang]);
      return;
    }
    if (newPassword.length < 6) {
      toast.error(T.tooShort[lang]);
      return;
    }
    if (newPassword === currentPassword) {
      toast.error(T.samePassword[lang]);
      return;
    }

    setSubmitting(true);
    const { error } = await changePassword(currentPassword, newPassword);
    setSubmitting(false);

    if (error) {
      toast.error(translateAuthError(error, lang));
      return;
    }

    toast.success(T.success[lang]);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  if (loading || !user) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center"
        style={{ backgroundColor: C.bg, color: C.muted }}
      >
        {T.loading[lang]}
      </div>
    );
  }

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

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.muted }}
              >
                {T.currentPassword[lang]}
              </label>
              <input
                required
                type={showPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: C.muted }}
              >
                {T.newPassword[lang]}
              </label>
              <div
                className="flex items-center"
                style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
              >
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                {T.confirmNewPassword[lang]}
              </label>
              <input
                required
                type={showPw ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-2 flex w-full items-center justify-center overflow-hidden py-3.5 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: C.accent }}
            >
              <span className="relative z-10">
                {submitting ? T.submitting[lang] : T.submit[lang]}
              </span>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </form>

          <Link
            href="/tai-khoan"
            className="mt-6 block text-center text-[13px] font-semibold underline underline-offset-4 transition-colors hover:text-white"
            style={{ color: C.muted }}
          >
            {T.backToAccount[lang]}
          </Link>
        </div>
      </div>
    </div>
  );
}
