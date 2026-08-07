import type { Metadata } from "next";
import { getDropById } from "@/lib/drops";
import { baseOpenGraph } from "@/app/shared-metadata";
import DropDetailPageClient from "./drop-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);
  if (!Number.isFinite(id)) return {};

  const drop = await getDropById(id);
  if (!drop) return {};

  const title = drop.title;
  const description = drop.sub?.vi || `Khám phá bộ sưu tập ${drop.title} tại PULSEGEAR.CLUB.`;

  return {
    title,
    description,
    openGraph: {
      ...baseOpenGraph,
      type: "website",
      title,
      description,
      images: drop.img ? [{ url: drop.img, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: drop.img ? [drop.img] : undefined,
    },
  };
}

export default function Page() {
  return <DropDetailPageClient />;
}
