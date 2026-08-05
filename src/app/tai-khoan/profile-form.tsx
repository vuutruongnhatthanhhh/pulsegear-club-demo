"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import { saveProfile } from "@/lib/profile";

const C = {
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  email: { vi: "Email", en: "Email" },
  fullName: { vi: "Họ và tên", en: "Full name" },
  phone: { vi: "Số điện thoại", en: "Phone number" },
  address: { vi: "Địa chỉ nhận hàng", en: "Delivery address" },
  save: { vi: "LƯU THAY ĐỔI", en: "SAVE CHANGES" },
  saving: { vi: "ĐANG LƯU...", en: "SAVING..." },
  error: {
    vi: "Không thể lưu thông tin, vui lòng thử lại.",
    en: "Couldn't save your profile, please try again.",
  },
};

type Profile = { fullName: string; phone: string; address: string };

export function ProfileForm({
  userId,
  email,
  initialProfile,
  onSaved,
}: {
  userId: string;
  email: string;
  initialProfile: Profile;
  onSaved: () => void;
}) {
  const lang = useI18nStore((s) => s.lang);

  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [address, setAddress] = useState(initialProfile.address);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  // Short cooldown after a successful save — blocks spam-clicking Save on top
  // of the "no changes" guard below (this write is RLS-scoped to the caller's
  // own row, so there's no cross-user abuse vector to defend against here,
  // just accidental rapid-fire clicks).
  const [cooldown, setCooldown] = useState(false);

  const hasChanges =
    fullName !== savedProfile.fullName ||
    phone !== savedProfile.phone ||
    address !== savedProfile.address;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await saveProfile(userId, { fullName, phone, address });
    setSubmitting(false);

    if (error) {
      toast.error(T.error[lang]);
      return;
    }

    setSavedProfile({ fullName, phone, address });
    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div>
        <label
          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: C.muted }}
        >
          {T.email[lang]}
        </label>
        <input
          disabled
          type="email"
          value={email}
          className="w-full cursor-not-allowed bg-transparent px-4 py-3 text-[14px] text-white/50 outline-none"
          style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
        />
      </div>

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
          style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
        />
      </div>

      <div>
        <label
          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: C.muted }}
        >
          {T.phone[lang]}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
          className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
          style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
        />
      </div>

      <div>
        <label
          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: C.muted }}
        >
          {T.address[lang]}
        </label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={lang === "vi" ? "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" : "Street, ward, district, city"}
          className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
          style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !hasChanges || cooldown}
        className="group relative mt-2 flex w-full items-center justify-center overflow-hidden py-3.5 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
        style={{ backgroundColor: C.accent }}
      >
        <span className="relative z-10">
          {submitting ? T.saving[lang] : T.save[lang]}
        </span>
        <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
      </button>
    </form>
  );
}
