import { supabase } from "./supabaseClient";

export type ContactHeroSection = {
  eyebrow: { vi: string; en: string };
  title1: { vi: string; en: string };
  title2: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  image: string;
  addressLabel: { vi: string; en: string };
  addressValue: { vi: string; en: string };
  phoneLabel: { vi: string; en: string };
  emailLabel: { vi: string; en: string };
  hoursLabel: { vi: string; en: string };
  hoursValue: { vi: string; en: string };
};

type ContactHeroRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title1_vi: string;
  title1_en: string;
  title2_vi: string;
  title2_en: string;
  subtitle_vi: string;
  subtitle_en: string;
  image_url: string | null;
  address_label_vi: string;
  address_label_en: string;
  address_value_vi: string;
  address_value_en: string;
  phone_label_vi: string;
  phone_label_en: string;
  email_label_vi: string;
  email_label_en: string;
  hours_label_vi: string;
  hours_label_en: string;
  hours_value_vi: string;
  hours_value_en: string;
};

// Fallback — the content already hardcoded in lien-he/page.tsx before this table existed.
export const FALLBACK_CONTACT_HERO: ContactHeroSection = {
  eyebrow: { vi: "LIÊN HỆ", en: "CONTACT" },
  title1: { vi: "NÓI CHUYỆN", en: "LET'S" },
  title2: { vi: "VỚI CHÚNG TÔI", en: "TALK" },
  subtitle: {
    vi: "Có câu hỏi về sản phẩm, đơn hàng hay hợp tác? Đội ngũ PULSEGEAR.CLUB luôn sẵn sàng hỗ trợ bạn.",
    en: "Questions about products, orders, or partnerships? The PULSEGEAR.CLUB team is here to help.",
  },
  image: "/images/contact/hero.jpg",
  addressLabel: { vi: "Địa chỉ", en: "Address" },
  addressValue: {
    vi: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    en: "123 ABC Street, XYZ Ward, District 1, Ho Chi Minh City",
  },
  phoneLabel: { vi: "Điện thoại", en: "Phone" },
  emailLabel: { vi: "Email", en: "Email" },
  hoursLabel: { vi: "Giờ làm việc", en: "Working Hours" },
  hoursValue: {
    vi: "T2 – T7: 8:00 – 21:00",
    en: "Mon – Sat: 8:00 AM – 9:00 PM",
  },
};

export async function getContactHeroSection(): Promise<ContactHeroSection | null> {
  const { data, error } = await supabase
    .from("contact_hero_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as ContactHeroRow;

  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title1: { vi: row.title1_vi, en: row.title1_en },
    title2: { vi: row.title2_vi, en: row.title2_en },
    subtitle: { vi: row.subtitle_vi, en: row.subtitle_en },
    image: row.image_url ?? FALLBACK_CONTACT_HERO.image,
    addressLabel: { vi: row.address_label_vi, en: row.address_label_en },
    addressValue: { vi: row.address_value_vi, en: row.address_value_en },
    phoneLabel: { vi: row.phone_label_vi, en: row.phone_label_en },
    emailLabel: { vi: row.email_label_vi, en: row.email_label_en },
    hoursLabel: { vi: row.hours_label_vi, en: row.hours_label_en },
    hoursValue: { vi: row.hours_value_vi, en: row.hours_value_en },
  };
}
