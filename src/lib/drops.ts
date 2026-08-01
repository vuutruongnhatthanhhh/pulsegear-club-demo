import { supabase } from "./supabaseClient";

export type Drop = {
  id: number;
  badge: { vi: string; en: string };
  title: string;
  sub: { vi: string; en: string };
  tag: { vi: string; en: string };
  glow: string;
  img: string;
  href: string;
};

type DropRow = {
  id: number;
  badge_vi: string;
  badge_en: string;
  title: string;
  sub_vi: string;
  sub_en: string;
  tag_vi: string;
  tag_en: string;
  glow_color: string;
  image_url: string | null;
  href: string;
};

function mapDrop(row: DropRow): Drop {
  return {
    id: row.id,
    badge: { vi: row.badge_vi, en: row.badge_en },
    title: row.title,
    sub: { vi: row.sub_vi, en: row.sub_en },
    tag: { vi: row.tag_vi, en: row.tag_en },
    glow: row.glow_color,
    img: row.image_url ?? "/images/home/drop-apex.jpg",
    href: row.href,
  };
}

/** All drops, in sort order — used by the /bo-suu-tap page. */
export async function getAllDrops(): Promise<Drop[]> {
  const { data, error } = await supabase.from("drops").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as DropRow[]).map(mapDrop);
}

/** Only the drops flagged to appear in the homepage "Latest drops" preview. */
export async function getHomepageDrops(): Promise<Drop[]> {
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("show_on_homepage", true)
    .order("sort_order");
  if (error || !data) return [];
  return (data as DropRow[]).map(mapDrop);
}

// Fallback drops — shown until items load from the DB (and if the table is empty).
export const FALLBACK_DROPS: Drop[] = [
  {
    id: 1,
    badge: { vi: "VỪA RA MẮT", en: "JUST LAUNCHED" },
    title: "APEX PRO SERIES",
    sub: {
      vi: "Trang phục tập luyện hiệu suất cao dành cho vận động viên đỉnh cao.",
      en: "High-performance training gear built for elite athletes.",
    },
    tag: { vi: "Nam & Nữ", en: "Men & Women" },
    glow: "#FF3C00",
    img: "/images/home/drop-apex.jpg",
    href: "/do-nam",
  },
  {
    id: 2,
    badge: { vi: "MÙA MỚI", en: "NEW SEASON" },
    title: "SEAMLESS V2",
    sub: {
      vi: "Cảm giác như làn da thứ hai với công nghệ co giãn 4 chiều.",
      en: "Feels like a second skin with 4-way stretch technology.",
    },
    tag: { vi: "Bộ sưu tập Nữ", en: "Women's Collection" },
    glow: "#A855F7",
    img: "/images/home/category-accessories.jpg",
    href: "/lien-mach",
  },
  {
    id: 3,
    badge: { vi: "BÁN CHẠY NHẤT", en: "BEST SELLER" },
    title: "VITAL SEAMLESS",
    sub: {
      vi: "Bộ sưu tập đã tạo nên tên tuổi chúng tôi. Phiên bản tái sinh.",
      en: "The collection that made our name. Reborn.",
    },
    tag: { vi: "Dòng đặc trưng", en: "Signature Line" },
    glow: "#00C8FF",
    img: "/images/home/drop-vital-seamless.jpg",
    href: "/lien-mach",
  },
  {
    id: 4,
    badge: { vi: "SẴN SÀNG CHO MÙA LẠNH", en: "COLD SEASON READY" },
    title: "STORM SHIELD JACKETS",
    sub: {
      vi: "Lớp bảo vệ nhẹ, ấm và không cản trở chuyển động khi tập luyện.",
      en: "Lightweight, warm outerwear that never gets in your way.",
    },
    tag: { vi: "Bộ sưu tập Áo Khoác", en: "Jackets Collection" },
    glow: "#F59E0B",
    img: "/images/products/ao-khoac/1.jpg",
    href: "/ao-khoac",
  },
  {
    id: 5,
    badge: { vi: "MỚI VỀ", en: "NEW IN" },
    title: "TRAINING ESSENTIALS",
    sub: {
      vi: "Những món đồ cơ bản mọi vận động viên cần có trong tủ đồ.",
      en: "The core pieces every athlete needs in their closet.",
    },
    tag: { vi: "Bộ sưu tập Nam", en: "Men's Collection" },
    glow: "#FF3C00",
    img: "/images/products/do-nam/3.jpg",
    href: "/do-nam",
  },
  {
    id: 6,
    badge: { vi: "HOÀN THIỆN SETUP", en: "COMPLETE THE KIT" },
    title: "GEAR UP ACCESSORIES",
    sub: {
      vi: "Từ túi tập đến phụ kiện hỗ trợ — hoàn thiện buổi tập của bạn.",
      en: "From gym bags to training support — complete your workout kit.",
    },
    tag: { vi: "Bộ sưu tập Phụ Kiện", en: "Accessories Collection" },
    glow: "#22C55E",
    img: "/images/products/phu-kien/1.jpg",
    href: "/phu-kien",
  },
];

/** The 3 drops shown on the homepage before the DB loads. */
export const FALLBACK_HOMEPAGE_DROPS: Drop[] = FALLBACK_DROPS.slice(0, 3);
