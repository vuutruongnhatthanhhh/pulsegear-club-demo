import config from "@/config";

export const baseOpenGraph = {
  type: "website" as const,
  siteName: config.companyName,
  locale: "vi_VN",
  alternateLocale: ["en_US"],
};
