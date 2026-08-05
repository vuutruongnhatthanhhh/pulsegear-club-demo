"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "#888888";

export function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  required,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="flex items-center"
      style={{ border: `1px solid ${BORDER}`, backgroundColor: "#141414" }}
    >
      <input
        required={required}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="px-3 transition-colors hover:text-white"
        style={{ color: MUTED }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
