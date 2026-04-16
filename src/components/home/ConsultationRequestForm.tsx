"use client";

import React, { useMemo, useState } from "react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import {
  Mail,
  Phone,
  User,
  SendHorizonal,
  MessageSquareText,
} from "lucide-react";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

function safeLang(lang: Lang) {
  return lang === "vi" || lang === "en" ? lang : ("vi" as Lang);
}

type Copy = {
  title: string;
  subtitle: string;
  name: string;
  phone: string;
  email: string;
  content: string;
  namePh: string;
  phonePh: string;
  emailPh: string;
  contentPh: string;
  submit: string;
  success: string;
  required: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    title: "YÊU CẦU TƯ VẤN",
    subtitle:
      "Để lại thông tin, chúng tôi sẽ liên hệ trong thời gian sớm nhất.",
    name: "Họ tên",
    phone: "Số ĐT",
    email: "Email",
    content: "Nội dung",
    namePh: "Nhập họ tên",
    phonePh: "Nhập số điện thoại",
    emailPh: "Nhập email",
    contentPh: "Nhập nội dung",
    submit: "Gửi yêu cầu",
    success: "Đã gửi yêu cầu! Chúng tôi sẽ liên hệ sớm.",
    required: "Vui lòng nhập đầy đủ thông tin bắt buộc.",
  },
  en: {
    title: "CONSULTATION REQUEST",
    subtitle: "Leave your details and we’ll get back to you soon.",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    content: "Message",
    namePh: "Enter your name",
    phonePh: "Enter your phone",
    emailPh: "Enter your email",
    contentPh: "Enter your message",
    submit: "Send request",
    success: "Request sent! We’ll contact you shortly.",
    required: "Please fill in all required fields.",
  },
};

export default function ConsultationRequestForm() {
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);
  const t = COPY[L];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const isValid = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const phoneOk = form.phone.trim().length >= 8; // nhẹ nhàng thôi
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const contentOk = form.content.trim().length >= 5;
    return nameOk && phoneOk && emailOk && contentOk;
  }, [form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!isValid) {
      setNotice({ type: "err", text: t.required });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          msg: form.content,
          company: "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Send failed");
      }

      setNotice({ type: "ok", text: t.success });
      setForm({ name: "", phone: "", email: "", content: "" });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          L === "vi"
            ? "Gửi yêu cầu thất bại. Vui lòng thử lại."
            : "Failed to send request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_70px_-50px_rgba(2,8,23,.65)]">
          {/* soft background */}
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${ACCENT} 0%, transparent 60%)`,
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle at 70% 70%, ${PRIMARY} 0%, transparent 60%)`,
            }}
          />

          {/* header bar */}
          <div
            className="relative px-6 py-6 md:px-10"
            style={{
              background: `linear-gradient(90deg, ${PRIMARY} 0%, #0A5A8A 55%, ${PRIMARY} 100%)`,
            }}
          >
            <h2 className="text-center text-xl font-extrabold tracking-wide text-white md:text-2xl">
              {t.title}
            </h2>
            <p className="mt-2 text-center text-[16px] text-white/90">
              {t.subtitle}
            </p>

            <div className="mt-4 flex justify-center">
              <span
                className="h-[3px] w-24 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={onSubmit}
            className="relative px-6 py-7 md:px-10 md:py-10"
          >
            <div className="grid gap-5">
              {/* Name */}
              <Field
                label={`${t.name} (*)`}
                icon={<User className="h-4 w-4" />}
                value={form.name}
                placeholder={t.namePh}
                onChange={(v) => setForm((s) => ({ ...s, name: v }))}
              />

              {/* Phone */}
              <Field
                label={`${t.phone} (*)`}
                icon={<Phone className="h-4 w-4" />}
                value={form.phone}
                placeholder={t.phonePh}
                onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                inputMode="tel"
              />

              {/* Email */}
              <Field
                label={`${t.email} (*)`}
                icon={<Mail className="h-4 w-4" />}
                value={form.email}
                placeholder={t.emailPh}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                inputMode="email"
              />

              {/* Content */}
              <TextAreaField
                label={`${t.content} (*)`}
                icon={<MessageSquareText className="h-4 w-4" />}
                value={form.content}
                placeholder={t.contentPh}
                onChange={(v) => setForm((s) => ({ ...s, content: v }))}
              />

              {/* Notice */}
              {notice && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                  style={{
                    borderColor:
                      notice.type === "ok"
                        ? "rgba(34,197,94,.35)"
                        : "rgba(239,68,68,.35)",
                    backgroundColor:
                      notice.type === "ok"
                        ? "rgba(34,197,94,.10)"
                        : "rgba(239,68,68,.10)",
                    color: notice.type === "ok" ? "#166534" : "#991B1B",
                  }}
                >
                  {notice.text}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm ">
                  {L === "vi"
                    ? "Bằng việc gửi yêu cầu, bạn đồng ý để chúng tôi liên hệ tư vấn."
                    : "By submitting, you agree that we may contact you for consultation."}
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={[
                    "inline-flex items-center justify-center gap-2",
                    "rounded-2xl px-6 py-3 text-sm font-extrabold text-white",
                    "shadow-[0_18px_40px_-28px_rgba(6,68,106,.9)]",
                    "transition active:translate-y-[1px]",
                    isSubmitting ? "opacity-70" : "hover:-translate-y-[1px]",
                  ].join(" ")}
                  style={{
                    background: `linear-gradient(90deg, ${PRIMARY} 0%, #0A5A8A 55%, ${PRIMARY} 100%)`,
                  }}
                >
                  <SendHorizonal className="h-4 w-4" />
                  {isSubmitting
                    ? L === "vi"
                      ? "Đang gửi..."
                      : "Sending..."
                    : t.submit}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  value,
  placeholder,
  onChange,
  inputMode,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-slate-700">
          {icon}
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={[
            "w-full rounded-2xl border bg-white px-11 py-3.5 text-sm text-slate-900",
            "outline-none transition",
            "border-slate-200 focus:border-slate-300",
            "focus:ring-4 focus:ring-[rgba(231,191,100,.22)]",
          ].join(" ")}
          style={{ caretColor: PRIMARY }}
        />

        {/* accent left bar */}
        <span
          className="pointer-events-none absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full opacity-80"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
    </label>
  );
}

function TextAreaField({
  label,
  icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-4 text-slate-500 transition group-focus-within:text-slate-700">
          {icon}
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className={[
            "w-full resize-none rounded-2xl border bg-white px-11 py-3.5 text-sm text-slate-900",
            "outline-none transition",
            "border-slate-200 focus:border-slate-300",
            "focus:ring-4 focus:ring-[rgba(231,191,100,.22)]",
          ].join(" ")}
          style={{ caretColor: PRIMARY }}
        />

        <span
          className="pointer-events-none absolute left-0 top-6 h-7 w-1 rounded-r-full opacity-80"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
    </label>
  );
}
