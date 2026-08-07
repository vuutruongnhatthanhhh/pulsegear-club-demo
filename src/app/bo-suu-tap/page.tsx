import type { Metadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import CollectionsPage from "@/components/collections/CollectionsPage";

const title = "Khám Phá Bộ Sưu Tập";
const description =
  "Từ dòng sản phẩm mới ra mắt đến những bộ sưu tập signature — tìm bộ đồ phù hợp với hành trình của bạn tại PULSEGEAR.CLUB.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { ...baseOpenGraph, type: "website", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function BoSuuTapPage() {
  return <CollectionsPage />;
}
