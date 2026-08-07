import type { Metadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import AboutPageClient from "./about-page-client";

const title = "Giới Thiệu";
const description =
  "PULSEGEAR.CLUB - hành trình, giá trị cốt lõi và đội ngũ đứng sau thương hiệu trang phục thể thao được hơn 2.5 triệu vận động viên tin dùng.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { ...baseOpenGraph, type: "website", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <AboutPageClient />;
}
