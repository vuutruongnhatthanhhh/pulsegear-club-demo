import type { Metadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import ContactPageClient from "./contact-page-client";

const title = "Liên Hệ";
const description =
  "Liên hệ với PULSEGEAR.CLUB — địa chỉ cửa hàng, số điện thoại, email và biểu mẫu gửi tin nhắn trực tiếp cho đội ngũ hỗ trợ.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { ...baseOpenGraph, type: "website", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <ContactPageClient />;
}
