import type { Lang } from "./store";
import type { I18N } from "@/services/OurPeopleService";

// mini dictionary theo key (chỗ nào cần thêm thì thêm dần)
const DICT = {
  header: {
    home: { en: "Home", vi: "Trang chủ" },
    businessConsulting: {
      en: "Business Consulting",
      vi: "Tư vấn doanh nghiệp",
    },
    foreignInvestment: {
      en: "Foreign Investment Consulting",
      vi: "Tư vấn đầu tư nước ngoài",
    },
    businessLicensing: {
      en: "Business Licensing Consulting",
      vi: "Tư vấn giấy phép kinh doanh",
    },
    accountingTax: {
      en: "Accounting & Tax Services",
      vi: "Kế toán - Thuế",
    },
    virtualOffice: {
      en: "Virtual Office Services",
      vi: "Văn phòng ảo",
    },
    otherServices: {
      en: "Other Services",
      vi: "Dịch vụ khác",
    },
    about: { en: "About Us", vi: "Giới thiệu" },
    // overview: { en: "Overview", vi: "Tổng quan" },
    // offices: { en: "Offices", vi: "Văn phòng" },
    // projects: { en: "Notable Recent Projects", vi: "Dự án tiêu biểu" },
    // awards: { en: "Awards", vi: "Giải thưởng" },
    // ourPeople: { en: "Our People", vi: "Tư vấn đầu tư nước ngoài" },
    // practices: { en: "Practices", vi: "Tư vấn giấy phép kinh doanh" },
    // knowledge: { en: "Knowledge Center", vi: "Kế toán - Thuế" },
    // careers: { en: "Careers", vi: "Văn phòng ảo" },
    contact: { en: "Contact", vi: "Liên hệ" },
    language: { en: "Language", vi: "Ngôn ngữ" },
  },
} as const;

export function t(path: string, lang: Lang): string {
  // path dạng "header.home"
  const parts = path.split(".");
  let node: any = DICT;
  for (const p of parts) {
    node = node?.[p];
    if (!node) return path; // fallback key
  }
  return node?.[lang] ?? node?.en ?? path;
}

// Ưu tiên hiển thị theo lang, fallback hợp lý
export function pickI18N(i?: I18N, lang: Lang = "en", fallback = ""): string {
  if (!i) return fallback;
  if (lang === "vi") return i.vi?.trim() || i.en?.trim() || fallback;
  return i.en?.trim() || i.vi?.trim() || fallback;
}
