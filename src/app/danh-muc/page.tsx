import type { Metadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import DanhMucPageClient from "./danh-muc-client";

const title = "Mua Theo Danh Mục";
const description =
  "Từ trang phục tập luyện đến phụ kiện hằng ngày — khám phá toàn bộ danh mục sản phẩm tại PULSEGEAR.CLUB.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { ...baseOpenGraph, type: "website", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <DanhMucPageClient />;
}
