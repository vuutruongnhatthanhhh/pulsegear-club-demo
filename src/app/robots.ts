import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/gio-hang",
          "/thanh-toan",
          "/tai-khoan",
          "/tai-khoan/",
          "/dang-nhap",
          "/dang-ky",
          "/quen-mat-khau",
          "/dat-lai-mat-khau",
          "/search",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
