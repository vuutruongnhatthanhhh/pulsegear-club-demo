import { supabase } from "./supabaseClient";

export type AboutStorySection = {
  eyebrow: { vi: string; en: string };
  title: { vi: string; en: string };
  paragraph1: { vi: string; en: string };
  paragraph2: { vi: string; en: string };
  paragraph3: { vi: string; en: string };
  quote: { vi: string; en: string };
  foundedLabel: { vi: string; en: string };
  foundedYear: string;
  image: string;
};

type AboutStoryRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title_vi: string;
  title_en: string;
  paragraph1_vi: string;
  paragraph1_en: string;
  paragraph2_vi: string;
  paragraph2_en: string;
  paragraph3_vi: string;
  paragraph3_en: string;
  quote_vi: string;
  quote_en: string;
  founded_label_vi: string;
  founded_label_en: string;
  founded_year: string;
  image_url: string | null;
};

// Fallback — the content already hardcoded in gioi-thieu/page.tsx before this table existed.
export const FALLBACK_ABOUT_STORY: AboutStorySection = {
  eyebrow: { vi: "CÂU CHUYỆN CỦA CHÚNG TÔI", en: "OUR STORY" },
  title: {
    vi: "TỪ PHÒNG GYM NHỎ ĐẾN THƯƠNG HIỆU TOÀN CẦU",
    en: "FROM A SMALL GYM TO A GLOBAL BRAND",
  },
  paragraph1: {
    vi: "PULSEGEAR.CLUB bắt đầu vào năm 2019 từ một phòng gym nhỏ ở TP.HCM, nơi nhà sáng lập không thể tìm được bất kỳ bộ trang phục tập luyện nào thực sự theo kịp cường độ của mình. Vải quá mỏng, đường may bung sau vài tuần, và không thiết kế nào tôn trọng chuyển động thật của cơ thể.",
    en: "PULSEGEAR.CLUB started in 2019 in a small gym in Ho Chi Minh City, where our founder couldn't find training gear that actually kept up with his intensity. Fabrics were too thin, seams gave out within weeks, and no design respected the way the body actually moves.",
  },
  paragraph2: {
    vi: "Vậy nên chúng tôi tự tạo ra nó. Từng mẫu vải, từng đường may, từng bản thiết kế đều được thử nghiệm trực tiếp trên sàn tập trước khi đến tay khách hàng. Không phòng lab xa xỉ, không quảng cáo hào nhoáng — chỉ có sự ám ảnh với hiệu suất thực sự.",
    en: "So we built it ourselves. Every fabric, every seam, every pattern was tested on the gym floor before it ever reached a customer. No fancy labs, no flashy ads — just an obsession with real performance.",
  },
  paragraph3: {
    vi: "Hôm nay, PULSEGEAR.CLUB đã có mặt tại hơn 45 quốc gia với hơn 2.5 triệu vận động viên tin dùng. Nhưng sứ mệnh vẫn không đổi: tạo ra trang phục xứng đáng với nỗ lực bạn bỏ ra mỗi ngày.",
    en: "Today, PULSEGEAR.CLUB ships to 45+ countries and is trusted by 2.5M+ athletes. But the mission hasn't changed: build gear worthy of the effort you put in every single day.",
  },
  quote: {
    vi: "“Chúng tôi không thiết kế cho phòng trưng bày. Chúng tôi thiết kế cho hiệp cuối cùng lúc 11 giờ đêm.”",
    en: "“We don't design for the showroom. We design for the last rep at 11pm.”",
  },
  foundedLabel: { vi: "THÀNH LẬP", en: "FOUNDED" },
  foundedYear: "2019",
  image: "/images/about/story.jpg",
};

export async function getAboutStorySection(): Promise<AboutStorySection | null> {
  const { data, error } = await supabase
    .from("about_story_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as AboutStoryRow;

  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title: { vi: row.title_vi, en: row.title_en },
    paragraph1: { vi: row.paragraph1_vi, en: row.paragraph1_en },
    paragraph2: { vi: row.paragraph2_vi, en: row.paragraph2_en },
    paragraph3: { vi: row.paragraph3_vi, en: row.paragraph3_en },
    quote: { vi: row.quote_vi, en: row.quote_en },
    foundedLabel: { vi: row.founded_label_vi, en: row.founded_label_en },
    foundedYear: row.founded_year || FALLBACK_ABOUT_STORY.foundedYear,
    image: row.image_url ?? FALLBACK_ABOUT_STORY.image,
  };
}
