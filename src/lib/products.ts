export type Product = {
  id: number;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string;
  tag?: { vi: string; en: string } | null;
  rating?: number;
};

export type CategoryMeta = {
  slug: string;
  title: { vi: string; en: string };
  sub: { vi: string; en: string };
  accent: string;
  heroImage: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "do-nam": {
    slug: "do-nam",
    title: { vi: "ĐỒ NAM", en: "MEN" },
    sub: {
      vi: "Trang phục tập luyện hiệu suất cao dành cho phái mạnh — bền bỉ, thoải mái và không giới hạn chuyển động.",
      en: "High-performance training gear built for men — durable, comfortable, and made to move.",
    },
    accent: "#FF3C00",
    heroImage: "/images/home/category-men.jpg",
  },
  "do-nu": {
    slug: "do-nu",
    title: { vi: "ĐỒ NỮ", en: "WOMEN" },
    sub: {
      vi: "Thiết kế cho cơ thể phụ nữ — từng đường may, từng mũi chỉ đều vì hiệu suất và sự thoải mái tối đa.",
      en: "Designed for the female body — every seam, every stitch built for performance and comfort.",
    },
    accent: "#A855F7",
    heroImage: "/images/home/hero-2.jpg",
  },
  "lien-mach": {
    slug: "lien-mach",
    title: { vi: "LIỀN MẠCH", en: "SEAMLESS" },
    sub: {
      vi: "Công nghệ liền mạch tiên tiến nhất — cảm giác như làn da thứ hai, co giãn 4 chiều, không giới hạn.",
      en: "Our most advanced seamless technology — feels like a second skin, 4-way stretch, zero restriction.",
    },
    accent: "#00C8FF",
    heroImage: "/images/home/category-seamless.jpg",
  },
  "ao-khoac": {
    slug: "ao-khoac",
    title: { vi: "ÁO KHOÁC", en: "JACKETS" },
    sub: {
      vi: "Lớp bảo vệ cho mọi điều kiện thời tiết — nhẹ, ấm và không cản trở chuyển động khi tập luyện.",
      en: "Weather-ready outerwear — lightweight, warm, and built to move with you.",
    },
    accent: "#F59E0B",
    heroImage: "/images/home/category-jackets.jpg",
  },
  "quan-short": {
    slug: "quan-short",
    title: { vi: "QUẦN SHORT", en: "SHORTS" },
    sub: {
      vi: "Thoáng khí, nhẹ nhàng và linh hoạt — sẵn sàng cho mọi bài tập từ chạy bộ đến phòng gym.",
      en: "Breathable, lightweight, and flexible — ready for everything from a run to the gym floor.",
    },
    accent: "#FF3C00",
    heroImage: "/images/home/drop-apex.jpg",
  },
  "phu-kien": {
    slug: "phu-kien",
    title: { vi: "PHỤ KIỆN", en: "ACCESSORIES" },
    sub: {
      vi: "Từ túi tập đến phụ kiện hỗ trợ — mọi thứ bạn cần để hoàn thiện buổi tập luyện.",
      en: "From gym bags to training essentials — everything you need to complete the workout.",
    },
    accent: "#22C55E",
    heroImage: "/images/home/category-accessories.jpg",
  },
  "giam-gia": {
    slug: "giam-gia",
    title: { vi: "GIẢM GIÁ", en: "SALE" },
    sub: {
      vi: "Ưu đãi giới hạn trên các sản phẩm được yêu thích nhất. Số lượng có hạn, nhanh tay lựa chọn.",
      en: "Limited-time deals on fan favorites. While supplies last.",
    },
    accent: "#FF3C00",
    heroImage: "/images/home/category-sale.jpg",
  },
};

export const PRODUCTS_BY_CATEGORY: Record<string, Product[]> = {
  "do-nam": [
    {
      id: 1,
      name: { vi: "Áo Hoodie APEX Performance", en: "APEX Performance Hoodie" },
      price: 590000,
      img: "/images/products/do-nam/1.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Áo Thun Tập Luyện Core", en: "Core Training Tee" },
      price: 350000,
      img: "/images/products/do-nam/2.jpg",
      rating: 4,
    },
    {
      id: 3,
      name: { vi: "Áo Khoác Track Momentum", en: "Momentum Track Jacket" },
      price: 890000,
      img: "/images/products/do-nam/3.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 4,
      name: { vi: "Quần Jogger Flex", en: "Flex Jogger Pants" },
      price: 620000,
      img: "/images/products/do-nam/4.jpg",
      rating: 4,
    },
    {
      id: 5,
      name: { vi: "Áo Compression Ignite", en: "Ignite Compression Shirt" },
      price: 480000,
      img: "/images/products/do-nam/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Áo Gió Trail Runner", en: "Trail Runner Windbreaker" },
      price: 750000,
      img: "/images/products/do-nam/6.jpg",
      rating: 5,
    },
  ],
  "do-nu": [
    {
      id: 1,
      name: { vi: "Áo Bra Thể Thao Seamless", en: "Seamless Sports Bra" },
      price: 420000,
      img: "/images/products/do-nu/1.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Quần Legging Cạp Cao", en: "High-Waist Leggings" },
      price: 590000,
      img: "/images/products/do-nu/2.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 3,
      name: { vi: "Áo Crop Top Flow", en: "Flow Crop Top" },
      price: 380000,
      img: "/images/products/do-nu/3.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: { vi: "Áo Khoác Zip Momentum", en: "Momentum Zip Jacket" },
      price: 780000,
      img: "/images/products/do-nu/4.jpg",
      rating: 4,
    },
    {
      id: 5,
      name: { vi: "Áo Tank Studio", en: "Studio Tank Top" },
      price: 320000,
      img: "/images/products/do-nu/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Quần Short Đạp Xe Sculpt", en: "Sculpt Bike Shorts" },
      price: 450000,
      img: "/images/products/do-nu/6.jpg",
      rating: 5,
    },
  ],
  "lien-mach": [
    {
      id: 1,
      name: { vi: "Quần Legging Seamless V2", en: "Seamless V2 Leggings" },
      price: 690000,
      img: "/images/products/lien-mach/1.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Áo Tay Dài Second-Skin", en: "Second-Skin Long Sleeve" },
      price: 490000,
      img: "/images/products/lien-mach/2.jpg",
      rating: 4,
    },
    {
      id: 3,
      name: { vi: "Áo Bra Seamless Pro", en: "Seamless Sports Bra Pro" },
      price: 450000,
      img: "/images/products/lien-mach/3.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 4,
      name: { vi: "Quần Short Contour", en: "Contour Shorts" },
      price: 420000,
      img: "/images/products/lien-mach/4.jpg",
      rating: 4,
    },
    {
      id: 5,
      name: { vi: "Áo Tank Seamless", en: "Seamless Tank" },
      price: 380000,
      img: "/images/products/lien-mach/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Bộ Seamless Toàn Thân", en: "Full-Length Seamless Set" },
      price: 990000,
      img: "/images/products/lien-mach/6.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
  ],
  "ao-khoac": [
    {
      id: 1,
      name: { vi: "Áo Khoác Storm Shield", en: "Storm Shield Jacket" },
      price: 950000,
      img: "/images/products/ao-khoac/1.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Áo Khoác Gió Windbreak", en: "Windbreak Track Jacket" },
      price: 780000,
      img: "/images/products/ao-khoac/2.jpg",
      rating: 4,
    },
    {
      id: 3,
      name: { vi: "Áo Hoodie Zip Thermal", en: "Thermal Zip Hoodie" },
      price: 690000,
      img: "/images/products/ao-khoac/3.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: { vi: "Áo Parka All-Weather", en: "All-Weather Parka" },
      price: 1290000,
      img: "/images/products/ao-khoac/4.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 5,
      name: { vi: "Áo Khoác Nhẹ Runner Shell", en: "Lightweight Runner Shell" },
      price: 650000,
      img: "/images/products/ao-khoac/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Áo Bomber Coach", en: "Coach Bomber Jacket" },
      price: 820000,
      img: "/images/products/ao-khoac/6.jpg",
      rating: 5,
    },
  ],
  "quan-short": [
    {
      id: 1,
      name: { vi: "Quần Short Chạy Bộ Sprint", en: "Sprint Running Shorts" },
      price: 320000,
      img: "/images/products/quan-short/1.jpg",
      rating: 4,
    },
    {
      id: 2,
      name: { vi: "Quần Short Tập Luyện Flex", en: "Flex Training Shorts" },
      price: 350000,
      img: "/images/products/quan-short/2.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 3,
      name: { vi: "Quần Short Lót Compression", en: "Compression Base Shorts" },
      price: 280000,
      img: "/images/products/quan-short/3.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: { vi: "Quần Short Gym 2-Trong-1", en: "Two-in-One Gym Shorts" },
      price: 390000,
      img: "/images/products/quan-short/4.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 5,
      name: { vi: "Quần Short Bóng Rổ Court", en: "Court Basketball Shorts" },
      price: 360000,
      img: "/images/products/quan-short/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Quần Short Leo Núi Trail", en: "Trail Hiking Shorts" },
      price: 420000,
      img: "/images/products/quan-short/6.jpg",
      rating: 4,
    },
  ],
  "phu-kien": [
    {
      id: 1,
      name: { vi: "Túi Gym Performance", en: "Performance Gym Bag" },
      price: 590000,
      img: "/images/products/phu-kien/1.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Nón Snapback Training", en: "Snapback Training Cap" },
      price: 250000,
      img: "/images/products/phu-kien/2.jpg",
      rating: 4,
    },
    {
      id: 3,
      name: { vi: "Găng Tay Tập Grip", en: "Grip Training Gloves" },
      price: 220000,
      img: "/images/products/phu-kien/3.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: { vi: "Bình Nước Giữ Nhiệt", en: "Insulated Water Bottle" },
      price: 180000,
      img: "/images/products/phu-kien/4.jpg",
      tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
      rating: 5,
    },
    {
      id: 5,
      name: { vi: "Bộ Dây Kháng Lực", en: "Resistance Band Set" },
      price: 290000,
      img: "/images/products/phu-kien/5.jpg",
      rating: 4,
    },
    {
      id: 6,
      name: { vi: "Đồng Hồ Thể Thao", en: "Sport Wrist Watch" },
      price: 1190000,
      img: "/images/products/phu-kien/6.jpg",
      tag: { vi: "MỚI", en: "NEW" },
      rating: 5,
    },
  ],
  "giam-gia": [
    {
      id: 1,
      name: { vi: "Áo Hoodie APEX Performance", en: "APEX Performance Hoodie" },
      price: 413000,
      oldPrice: 590000,
      img: "/images/products/do-nam/1.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 5,
    },
    {
      id: 2,
      name: { vi: "Quần Legging Cạp Cao", en: "High-Waist Leggings" },
      price: 413000,
      oldPrice: 590000,
      img: "/images/products/do-nu/2.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 5,
    },
    {
      id: 3,
      name: { vi: "Áo Khoác Gió Windbreak", en: "Windbreak Track Jacket" },
      price: 468000,
      oldPrice: 780000,
      img: "/images/products/ao-khoac/2.jpg",
      tag: { vi: "-40%", en: "-40%" },
      rating: 4,
    },
    {
      id: 4,
      name: { vi: "Quần Short Gym 2-Trong-1", en: "Two-in-One Gym Shorts" },
      price: 273000,
      oldPrice: 390000,
      img: "/images/products/quan-short/4.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 5,
    },
    {
      id: 5,
      name: { vi: "Quần Legging Seamless V2", en: "Seamless V2 Leggings" },
      price: 483000,
      oldPrice: 690000,
      img: "/images/products/lien-mach/1.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 5,
    },
    {
      id: 6,
      name: { vi: "Túi Gym Performance", en: "Performance Gym Bag" },
      price: 413000,
      oldPrice: 590000,
      img: "/images/products/phu-kien/1.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 4,
    },
    {
      id: 7,
      name: { vi: "Áo Thun Tập Luyện Core", en: "Core Training Tee" },
      price: 245000,
      oldPrice: 350000,
      img: "/images/products/do-nam/2.jpg",
      tag: { vi: "-30%", en: "-30%" },
      rating: 4,
    },
    {
      id: 8,
      name: { vi: "Áo Crop Top Flow", en: "Flow Crop Top" },
      price: 228000,
      oldPrice: 380000,
      img: "/images/products/do-nu/3.jpg",
      tag: { vi: "-40%", en: "-40%" },
      rating: 4,
    },
  ],
};

export function getProduct(category: string, id: number): Product | undefined {
  return PRODUCTS_BY_CATEGORY[category]?.find((p) => p.id === id);
}
