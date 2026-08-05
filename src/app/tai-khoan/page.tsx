"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import { useAuthStore } from "@/lib/auth/store";
import { getProfile } from "@/lib/profile";
import { ProfileForm } from "./profile-form";

const C = {
  bg: "#0A0A0A",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  eyebrow: { vi: "TÀI KHOẢN", en: "ACCOUNT" },
  title1: { vi: "THÔNG TIN", en: "PERSONAL" },
  title2: { vi: "CÁ NHÂN", en: "INFO" },
  sub: {
    vi: "Cập nhật tên, số điện thoại và địa chỉ nhận hàng của bạn.",
    en: "Update your name, phone number, and delivery address.",
  },
  loading: { vi: "Đang tải...", en: "Loading..." },
};

export default function TaiKhoanPage() {
  const lang = useI18nStore((s) => s.lang);
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [profile, setProfile] = useState<{ fullName: string; phone: string; address: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dang-nhap");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((data) => {
      setProfile(
        data ?? {
          fullName: (user.user_metadata?.full_name as string | undefined) ?? "",
          phone: "",
          address: "",
        },
      );
      setProfileLoading(false);
    });
  }, [user]);

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

          {profileLoading || !profile ? (
            <p className="mt-8 text-center text-sm" style={{ color: C.muted }}>
              {T.loading[lang]}
            </p>
          ) : (
            <ProfileForm
              userId={user.id}
              email={user.email ?? ""}
              initialProfile={profile}
              onSaved={() => toast.success(lang === "vi" ? "Đã lưu thông tin." : "Profile updated.")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
