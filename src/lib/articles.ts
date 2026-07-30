export type ArticleSection = {
  heading: { vi: string; en: string };
  paragraphs: { vi: string; en: string }[];
};

export type Article = {
  id: number;
  title: { vi: string; en: string };
  excerpt: { vi: string; en: string };
  sections: ArticleSection[];
  img: string;
  category: { vi: string; en: string };
  date: string;
  readTime: { vi: string; en: string };
  author: string;
  glow: string;
};

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: {
      vi: "5 Bài Tập Giúp Bạn Vượt Giới Hạn Bản Thân",
      en: "5 Workouts to Push Past Your Limits",
    },
    excerpt: {
      vi: "Từ HIIT đến sức bền, đây là 5 bài tập được các HLV của PULSEGEAR khuyên dùng để nâng cao hiệu suất.",
      en: "From HIIT to endurance, here are 5 workouts our coaches swear by to level up your performance.",
    },
    sections: [
      {
        heading: {
          vi: "Tại Sao Phải Tập Đúng Cách",
          en: "Why Training Smart Matters",
        },
        paragraphs: [
          {
            vi: "Vượt qua giới hạn bản thân không đến từ việc tập nhiều hơn — mà đến từ việc tập đúng cách. Đội ngũ huấn luyện viên của PULSEGEAR đã tổng hợp 5 bài tập then chốt giúp bạn phá vỡ những giới hạn tưởng chừng không thể vượt qua, dù bạn là người mới bắt đầu hay đã tập luyện nhiều năm.",
            en: "Pushing past your limits isn't about training more — it's about training smarter. Our coaching team has put together 5 essential workouts to help you break through plateaus, whether you're just starting out or have years of training behind you.",
          },
        ],
      },
      {
        heading: { vi: "HIIT Và Các Bài Tập Compound", en: "HIIT and Compound Lifts" },
        paragraphs: [
          {
            vi: "Đầu tiên là HIIT (High-Intensity Interval Training) — xen kẽ giữa cường độ tối đa và nghỉ ngắn giúp đốt calo hiệu quả và cải thiện sức bền tim mạch chỉ trong 20 phút. Tiếp theo là các bài tập compound như squat, deadlift và bench press, tác động đồng thời nhiều nhóm cơ và xây dựng sức mạnh nền tảng nhanh hơn các bài tập cô lập.",
            en: "First up is HIIT (High-Intensity Interval Training) — alternating between maximum effort and short rest periods torches calories and improves cardiovascular endurance in as little as 20 minutes. Next are compound lifts like squats, deadlifts, and bench press, which work multiple muscle groups at once and build foundational strength faster than isolation exercises.",
          },
        ],
      },
      {
        heading: {
          vi: "Plyometric, Core Và Giãn Cơ",
          en: "Plyometrics, Core, and Stretching",
        },
        paragraphs: [
          {
            vi: "Đừng bỏ qua bài tập plyometric — những động tác bật nhảy giúp tăng sức mạnh bùng nổ, rất quan trọng với người chơi thể thao. Bài tập thứ tư là core training toàn diện, không chỉ crunch mà còn plank, dead bug và các biến thể chống xoay để bảo vệ cột sống. Cuối cùng, đừng quên các bài giãn cơ động trước khi tập để chuẩn bị cơ thể tốt nhất.",
            en: "Don't sleep on plyometric training — explosive jump movements that build power, critical for anyone playing sports. Fourth is comprehensive core work — not just crunches, but planks, dead bugs, and anti-rotation variations that protect your spine. Finally, don't skip dynamic stretching before your session to prep your body properly.",
          },
        ],
      },
      {
        heading: {
          vi: "Áp Dụng Vào Lịch Tập Hàng Tuần",
          en: "Building Your Weekly Routine",
        },
        paragraphs: [
          {
            vi: "Kết hợp cả 5 bài tập này vào lịch trình hàng tuần, kèm theo nghỉ ngơi và dinh dưỡng hợp lý, bạn sẽ thấy sự khác biệt rõ rệt chỉ sau vài tuần. Hãy nhớ: tiến bộ đến từ sự kiên trì, không phải sự hoàn hảo.",
            en: "Work all 5 into your weekly routine, paired with proper rest and nutrition, and you'll see real differences within weeks. Remember: progress comes from consistency, not perfection.",
          },
        ],
      },
    ],
    img: "/images/news/1.jpg",
    category: { vi: "Tập Luyện", en: "Training" },
    date: "28/07/2026",
    readTime: { vi: "5 phút đọc", en: "5 min read" },
    author: "Đăng Khoa",
    glow: "#FF3C00",
  },
  {
    id: 2,
    title: {
      vi: "Dinh Dưỡng Trước Và Sau Khi Tập",
      en: "Nutrition Before and After Training",
    },
    excerpt: {
      vi: "Ăn gì trước và sau buổi tập để tối ưu hiệu suất và phục hồi nhanh hơn.",
      en: "What to eat before and after your workout to optimize performance and recover faster.",
    },
    sections: [
      {
        heading: {
          vi: "Dinh Dưỡng Quan Trọng Không Kém Buổi Tập",
          en: "Nutrition Matters as Much as the Workout",
        },
        paragraphs: [
          {
            vi: "Dinh dưỡng đóng vai trò không kém phần quan trọng so với bản thân buổi tập. Ăn đúng thời điểm và đúng loại thực phẩm có thể tạo ra khác biệt lớn giữa một buổi tập hiệu quả và một buổi tập uể oải.",
            en: "Nutrition matters just as much as the workout itself. Eating the right food at the right time can be the difference between a great session and a sluggish one.",
          },
        ],
      },
      {
        heading: { vi: "Ăn Gì Trước Khi Tập", en: "What to Eat Before Training" },
        paragraphs: [
          {
            vi: "Trước khi tập 60-90 phút, ưu tiên carb phức hợp kết hợp một ít protein — như yến mạch với chuối, hoặc bánh mì nguyên cám với trứng. Điều này cung cấp năng lượng ổn định mà không gây nặng bụng. Tránh thức ăn nhiều dầu mỡ hoặc chất xơ quá cao ngay trước buổi tập vì dễ gây khó chịu đường tiêu hóa.",
            en: "60–90 minutes before training, prioritize complex carbs paired with a bit of protein — think oatmeal with banana, or whole-grain toast with eggs. This gives you steady energy without weighing you down. Avoid heavy or high-fiber foods right before training since they can cause GI discomfort.",
          },
        ],
      },
      {
        heading: { vi: "Ăn Gì Sau Khi Tập", en: "What to Eat After Training" },
        paragraphs: [
          {
            vi: "Sau khi tập, cơ thể bạn cần protein để phục hồi cơ bắp và carb để nạp lại glycogen đã tiêu hao. Một ly protein shake với trái cây, hoặc ức gà với cơm và rau củ trong vòng 45-60 phút sau buổi tập sẽ tối ưu hoá quá trình phục hồi.",
            en: "After training, your body needs protein to repair muscle and carbs to refill depleted glycogen stores. A protein shake with fruit, or grilled chicken with rice and vegetables within 45–60 minutes post-workout will optimize recovery.",
          },
        ],
      },
      {
        heading: {
          vi: "Đừng Quên Bổ Sung Nước",
          en: "Don't Forget Hydration",
        },
        paragraphs: [
          {
            vi: "Đừng quên nước — mất nước dù chỉ 2% trọng lượng cơ thể cũng có thể làm giảm hiệu suất đáng kể. Uống đủ nước trước, trong và sau buổi tập là nền tảng của mọi chiến lược dinh dưỡng thể thao.",
            en: "Don't forget hydration — even 2% body weight in fluid loss can meaningfully hurt performance. Drinking enough water before, during, and after training is the foundation of any sports nutrition strategy.",
          },
        ],
      },
    ],
    img: "/images/news/2.jpg",
    category: { vi: "Dinh Dưỡng", en: "Nutrition" },
    date: "22/07/2026",
    readTime: { vi: "4 phút đọc", en: "4 min read" },
    author: "Linh Chi",
    glow: "#22C55E",
  },
  {
    id: 3,
    title: {
      vi: "Câu Chuyện: Từ Người Mới Đến Vận Động Viên",
      en: "From Beginner to Athlete: A Member Story",
    },
    excerpt: {
      vi: "Hành trình 2 năm của một thành viên PULSEGEAR từ những buổi tập đầu tiên đến giải đấu chuyên nghiệp.",
      en: "One member's two-year journey from their first workout to competing professionally.",
    },
    sections: [
      {
        heading: {
          vi: "Khởi Đầu Với Đôi Giày Mượn",
          en: "Starting With Borrowed Shoes",
        },
        paragraphs: [
          {
            vi: "Hai năm trước, Minh Anh bước vào phòng gym lần đầu tiên với đôi giày mượn và không biết bắt đầu từ đâu. Hôm nay, cô là vận động viên thi đấu chuyên nghiệp trong bộ môn CrossFit, đại diện cho đội tuyển khu vực miền Nam.",
            en: "Two years ago, Minh Anh walked into a gym for the first time wearing borrowed shoes, not knowing where to start. Today, she's a competitive CrossFit athlete representing the southern regional team.",
          },
        ],
      },
      {
        heading: {
          vi: "Vượt Qua Nỗi Sợ Ban Đầu",
          en: "Overcoming the Initial Fear",
        },
        paragraphs: [
          {
            vi: "\"Điều khó nhất không phải là bài tập,\" Minh Anh chia sẻ, \"mà là vượt qua nỗi sợ bước vào một môi trường mình chưa quen thuộc.\" Cô bắt đầu với những buổi tập cơ bản 3 lần/tuần, tập trung vào kỹ thuật hơn là khối lượng tạ.",
            en: "\"The hardest part wasn't the workouts,\" Minh Anh shares, \"it was overcoming the fear of stepping into an environment I wasn't familiar with.\" She started with basic sessions three times a week, focusing on technique over load.",
          },
        ],
      },
      {
        heading: {
          vi: "Những Thay Đổi Sau 6 Tháng",
          en: "Six Months of Change",
        },
        paragraphs: [
          {
            vi: "Sau 6 tháng kiên trì, Minh Anh nhận thấy sự thay đổi rõ rệt — không chỉ về thể chất mà cả tinh thần. \"Tôi ngủ ngon hơn, làm việc tập trung hơn, và quan trọng nhất là tôi tự tin hơn rất nhiều.\" Đó là lúc cô quyết định thử sức với các giải đấu nghiệp dư đầu tiên.",
            en: "After six months of consistency, Minh Anh noticed real changes — not just physically, but mentally. \"I sleep better, I focus better at work, and most importantly, I'm so much more confident.\" That's when she decided to try her first amateur competitions.",
          },
        ],
      },
      {
        heading: {
          vi: "Hướng Tới Giải Đấu Khu Vực",
          en: "Preparing for Regionals",
        },
        paragraphs: [
          {
            vi: "Giờ đây, với lịch tập 6 buổi/tuần và sự hỗ trợ từ đội ngũ HLV PULSEGEAR, Minh Anh đang chuẩn bị cho giải đấu khu vực sắp tới. \"Nếu tôi làm được, bất kỳ ai cũng có thể. Chỉ cần bắt đầu.\"",
            en: "Now training six days a week with support from the PULSEGEAR coaching team, Minh Anh is preparing for the upcoming regional championship. \"If I can do it, anyone can. You just have to start.\"",
          },
        ],
      },
    ],
    img: "/images/news/3.jpg",
    category: { vi: "Cộng Đồng", en: "Community" },
    date: "15/07/2026",
    readTime: { vi: "6 phút đọc", en: "6 min read" },
    author: "Bảo Trân",
    glow: "#A855F7",
  },
  {
    id: 4,
    title: {
      vi: "Công Nghệ Vải Seamless Hoạt Động Như Thế Nào",
      en: "How Seamless Fabric Technology Works",
    },
    excerpt: {
      vi: "Khám phá quy trình dệt liền mạch giúp trang phục PULSEGEAR co giãn 4 chiều và không đường may.",
      en: "A look inside the seamless knitting process behind PULSEGEAR's 4-way stretch, no-seam gear.",
    },
    sections: [
      {
        heading: { vi: "Dệt Liền Mạch Là Gì", en: "What Is Seamless Knitting" },
        paragraphs: [
          {
            vi: "Khác với trang phục truyền thống được cắt từ nhiều mảnh vải rồi may lại, công nghệ dệt liền mạch (seamless knitting) tạo ra toàn bộ sản phẩm từ một sợi vải liên tục trên máy dệt tròn công nghệ cao — không cần đường may nối.",
            en: "Unlike traditional garments cut from multiple fabric pieces and sewn together, seamless knitting technology creates the entire product from one continuous yarn on advanced circular knitting machines — no seams required.",
          },
        ],
      },
      {
        heading: {
          vi: "Không Đường May, Không Cọ Xát",
          en: "No Seams, No Chafing",
        },
        paragraphs: [
          {
            vi: "Kết quả là một sản phẩm không có điểm cọ xát, giảm thiểu nguy cơ trầy da khi vận động cường độ cao, đồng thời tạo cảm giác ôm sát như làn da thứ hai. Máy dệt có thể điều chỉnh mật độ sợi theo từng vùng — dày hơn ở nơi cần hỗ trợ (như vùng bụng, hông) và mỏng, thoáng khí hơn ở vùng cần thoát nhiệt.",
            en: "The result is a garment with zero chafe points, dramatically reducing skin irritation during high-intensity movement, while feeling like a second skin. The machines can adjust knit density by zone — denser where support is needed (like the core and hips) and lighter, more breathable where heat needs to escape.",
          },
        ],
      },
      {
        heading: {
          vi: "Chất Liệu Và Tính Bền Vững",
          en: "Materials and Sustainability",
        },
        paragraphs: [
          {
            vi: "Sợi vải PULSEGEAR sử dụng kết hợp nylon tái chế và spandex, mang lại độ co giãn 4 chiều mà vẫn giữ được form dáng sau hàng trăm lần giặt. Quy trình sản xuất liền mạch cũng giảm thiểu vải thừa đáng kể so với phương pháp cắt may truyền thống — một bước tiến quan trọng hướng tới sản xuất bền vững.",
            en: "PULSEGEAR's yarn blends recycled nylon with spandex, delivering 4-way stretch that holds its shape through hundreds of washes. The seamless process also significantly reduces fabric waste compared to traditional cut-and-sew methods — an important step toward more sustainable production.",
          },
        ],
      },
      {
        heading: {
          vi: "Trải Nghiệm Thực Tế",
          en: "The Real-World Experience",
        },
        paragraphs: [
          {
            vi: "Lần tới khi bạn mặc một sản phẩm seamless của PULSEGEAR, hãy nhớ rằng đó là kết quả của hàng giờ nghiên cứu và tinh chỉnh công nghệ để mang lại trải nghiệm tập luyện tốt nhất có thể.",
            en: "Next time you put on a PULSEGEAR seamless piece, remember it's the result of hours of research and technical refinement, all in service of the best possible training experience.",
          },
        ],
      },
    ],
    img: "/images/news/4.jpg",
    category: { vi: "Sản Phẩm", en: "Product" },
    date: "08/07/2026",
    readTime: { vi: "5 phút đọc", en: "5 min read" },
    author: "Quang Huy",
    glow: "#00C8FF",
  },
  {
    id: 5,
    title: {
      vi: "5 Sai Lầm Thường Gặp Khi Tập Gym",
      en: "5 Common Mistakes When Training",
    },
    excerpt: {
      vi: "Tránh những lỗi phổ biến này để tập luyện an toàn hơn và đạt kết quả nhanh hơn.",
      en: "Avoid these common pitfalls to train safer and see results faster.",
    },
    sections: [
      {
        heading: {
          vi: "Những Lỗi Cơ Bản Vẫn Thường Gặp",
          en: "Basic Mistakes Still Happen",
        },
        paragraphs: [
          {
            vi: "Ngay cả những người tập luyện lâu năm cũng có thể mắc phải những sai lầm cơ bản làm chậm tiến độ hoặc tăng nguy cơ chấn thương. Dưới đây là 5 lỗi phổ biến nhất mà đội ngũ HLV PULSEGEAR thường gặp.",
            en: "Even experienced lifters can fall into basic mistakes that slow progress or raise injury risk. Here are the 5 most common errors our coaching team sees.",
          },
        ],
      },
      {
        heading: {
          vi: "Bỏ Qua Khởi Động Và Sai Kỹ Thuật",
          en: "Skipping Warm-Ups and Bad Form",
        },
        paragraphs: [
          {
            vi: "Thứ nhất, bỏ qua khởi động. Nhảy thẳng vào bài tập nặng mà không làm nóng cơ thể làm tăng nguy cơ chấn thương đáng kể. Thứ hai, tập sai kỹ thuật để nâng tạ nặng hơn — điều này không chỉ kém hiệu quả mà còn rất nguy hiểm cho khớp và cột sống.",
            en: "First, skipping warm-ups. Jumping straight into heavy lifts without prepping your body significantly increases injury risk. Second, sacrificing form to lift heavier — not only less effective, but genuinely dangerous for joints and spine.",
          },
        ],
      },
      {
        heading: {
          vi: "Thiếu Nghỉ Ngơi Và Mất Cân Bằng Cơ",
          en: "Not Enough Rest and Muscle Imbalance",
        },
        paragraphs: [
          {
            vi: "Thứ ba, không nghỉ ngơi đủ giữa các buổi tập. Cơ bắp phát triển trong lúc nghỉ ngơi, không phải trong lúc tập — tập luyện quá độ (overtraining) sẽ phản tác dụng. Thứ tư, chỉ tập trung vào một nhóm cơ mà bỏ qua các nhóm cơ đối kháng, dẫn đến mất cân bằng cơ thể.",
            en: "Third, not resting enough between sessions. Muscles grow during rest, not during the workout itself — overtraining is counterproductive. Fourth, only training one muscle group while neglecting opposing groups, leading to imbalances.",
          },
        ],
      },
      {
        heading: {
          vi: "Kỳ Vọng Không Thực Tế",
          en: "Unrealistic Expectations",
        },
        paragraphs: [
          {
            vi: "Cuối cùng, đặt mục tiêu không thực tế và bỏ cuộc khi không thấy kết quả ngay. Thay đổi cơ thể cần thời gian — hãy kiên nhẫn, theo dõi tiến độ một cách khách quan và tin tưởng vào quá trình.",
            en: "Finally, setting unrealistic goals and giving up when results don't show immediately. Body transformation takes time — be patient, track progress objectively, and trust the process.",
          },
        ],
      },
    ],
    img: "/images/news/5.jpg",
    category: { vi: "Mẹo Hay", en: "Tips" },
    date: "01/07/2026",
    readTime: { vi: "4 phút đọc", en: "4 min read" },
    author: "Đăng Khoa",
    glow: "#F59E0B",
  },
  {
    id: 6,
    title: {
      vi: "PULSEGEAR Ra Mắt Bộ Sưu Tập SS25",
      en: "PULSEGEAR Launches the SS25 Collection",
    },
    excerpt: {
      vi: "Bộ sưu tập mới nhất đã chính thức ra mắt — được tạo ra cho những người không bao giờ dừng lại.",
      en: "Our latest collection has officially landed — made for those who never stop.",
    },
    sections: [
      {
        heading: {
          vi: "Hơn Một Năm Nghiên Cứu",
          en: "Over a Year in the Making",
        },
        paragraphs: [
          {
            vi: "PULSEGEAR.CLUB chính thức ra mắt bộ sưu tập Xuân/Hè 2025 (SS25) — kết quả của hơn một năm nghiên cứu, thử nghiệm và phản hồi trực tiếp từ cộng đồng hơn 2.5 triệu vận động viên trên toàn cầu.",
            en: "PULSEGEAR.CLUB officially launches its Spring/Summer 2025 (SS25) collection — the result of over a year of research, testing, and direct feedback from our community of 2.5M+ athletes worldwide.",
          },
        ],
      },
      {
        heading: {
          vi: "Điểm Nhấn: APEX Pro Series Và Seamless V2",
          en: "Spotlight: APEX Pro Series and Seamless V2",
        },
        paragraphs: [
          {
            vi: "Điểm nhấn của bộ sưu tập là dòng APEX Pro Series — trang phục tập luyện hiệu suất cao với công nghệ vải mới giúp thoát ẩm nhanh hơn 30% so với thế hệ trước. Bên cạnh đó, dòng Seamless V2 cũng được nâng cấp với form dáng ôm sát tối ưu và độ bền cao hơn.",
            en: "The collection's centerpiece is the APEX Pro Series — high-performance training gear featuring new fabric technology that wicks moisture 30% faster than the previous generation. The Seamless V2 line also gets an upgrade, with an optimized fit and improved durability.",
          },
        ],
      },
      {
        heading: {
          vi: "Công Cụ Giúp Bạn Vượt Giới Hạn",
          en: "Tools to Push Past Your Limits",
        },
        paragraphs: [
          {
            vi: "\"Chúng tôi không chỉ tạo ra quần áo, chúng tôi tạo ra công cụ giúp bạn vượt qua giới hạn bản thân,\" đại diện PULSEGEAR chia sẻ. Bộ sưu tập SS25 hiện đã có mặt trên toàn bộ hệ thống cửa hàng và website chính thức.",
            en: "\"We're not just making clothes, we're making tools to help you push past your limits,\" a PULSEGEAR spokesperson shared. The SS25 collection is now live across all stores and the official website.",
          },
        ],
      },
      {
        heading: {
          vi: "Ưu Đãi Dành Cho Thành Viên",
          en: "Exclusive Member Access",
        },
        paragraphs: [
          {
            vi: "Thành viên PULSEGEAR.CLUB sẽ được ưu tiên trải nghiệm sớm cùng ưu đãi độc quyền trong tuần ra mắt. Đừng bỏ lỡ cơ hội sở hữu những sản phẩm mới nhất từ thương hiệu.",
            en: "PULSEGEAR.CLUB members get early access and exclusive launch-week offers. Don't miss your chance to get the brand's newest gear first.",
          },
        ],
      },
    ],
    img: "/images/news/6.jpg",
    category: { vi: "Thương Hiệu", en: "Brand News" },
    date: "20/06/2026",
    readTime: { vi: "3 phút đọc", en: "3 min read" },
    author: "PULSEGEAR Team",
    glow: "#FF3C00",
  },
  {
    id: 7,
    title: {
      vi: "Phục Hồi Cơ Bắp: Hướng Dẫn Đầy Đủ",
      en: "Muscle Recovery: The Complete Guide",
    },
    excerpt: {
      vi: "Giãn cơ, ngủ đủ giấc và dinh dưỡng — mọi thứ bạn cần biết để phục hồi đúng cách.",
      en: "Stretching, sleep, and nutrition — everything you need to know to recover the right way.",
    },
    sections: [
      {
        heading: {
          vi: "Phục Hồi Là Một Phần Của Tập Luyện",
          en: "Recovery Is Part of Training",
        },
        paragraphs: [
          {
            vi: "Phục hồi không phải là thời gian \"nghỉ tập\" mà là một phần không thể thiếu của quá trình tập luyện. Đây là lúc cơ bắp thực sự phát triển và cơ thể thích nghi với cường độ tập luyện.",
            en: "Recovery isn't \"time off\" — it's an essential part of training. This is when muscles actually grow and your body adapts to training stress.",
          },
        ],
      },
      {
        heading: {
          vi: "Giấc Ngủ: Yếu Tố Quan Trọng Nhất",
          en: "Sleep: The Most Important Factor",
        },
        paragraphs: [
          {
            vi: "Giấc ngủ là yếu tố phục hồi quan trọng nhất — cơ thể sản sinh hormone tăng trưởng chủ yếu trong giấc ngủ sâu. Người tập luyện cường độ cao nên ngủ đủ 7-9 tiếng mỗi đêm để tối ưu hoá phục hồi.",
            en: "Sleep is the single most important recovery factor — growth hormone is produced primarily during deep sleep. Athletes training at high intensity should aim for 7–9 hours per night to optimize recovery.",
          },
        ],
      },
      {
        heading: {
          vi: "Giãn Cơ Và Foam Rolling",
          en: "Stretching and Foam Rolling",
        },
        paragraphs: [
          {
            vi: "Giãn cơ tĩnh sau buổi tập giúp giảm căng cơ và cải thiện độ linh hoạt về lâu dài. Kết hợp với foam rolling để giải phóng các điểm co cứng (trigger points) trong mô cơ, giúp giảm đau nhức và tăng lưu thông máu.",
            en: "Static stretching after training helps reduce muscle tension and improves flexibility over time. Pair it with foam rolling to release trigger points in muscle tissue, reducing soreness and improving blood flow.",
          },
        ],
      },
      {
        heading: {
          vi: "Ngày Nghỉ Và Phục Hồi Chủ Động",
          en: "Rest Days and Active Recovery",
        },
        paragraphs: [
          {
            vi: "Cuối cùng, đừng đánh giá thấp vai trò của ngày nghỉ hoàn toàn (rest day) và active recovery như đi bộ nhẹ, yoga hoặc bơi lội. Lắng nghe cơ thể và điều chỉnh cường độ tập luyện là chìa khóa để tiến bộ bền vững mà không chấn thương.",
            en: "Finally, don't underestimate full rest days and active recovery like light walking, yoga, or swimming. Listening to your body and adjusting training intensity is the key to sustainable progress without injury.",
          },
        ],
      },
    ],
    img: "/images/news/7.jpg",
    category: { vi: "Phục Hồi", en: "Recovery" },
    date: "12/06/2026",
    readTime: { vi: "4 phút đọc", en: "4 min read" },
    author: "Linh Chi",
    glow: "#22C55E",
  },
];

export function getArticle(id: number): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
