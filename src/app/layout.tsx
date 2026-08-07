import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";
import ContactBox from "@/components/contact/ContactBox";
import { baseOpenGraph } from "./shared-metadata";
import { SITE_URL } from "@/lib/seo";
import Script from "next/script";
import { Toaster } from "sonner";
import BackToTopButton from "@/components/layout/BackToTopButton";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import I18nGate from "@/lib/i18n/I18nGate";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import FlyToCartLayer from "@/components/cart/FlyToCartLayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${config.companyName}`,
    default: config.seoTitle,
  },
  description: config.seoDescription,
  keywords: [
    "pulsegear",
    "đồ thể thao",
    "trang phục tập gym",
    "quần áo thể thao",
    "phụ kiện thể thao",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.jpg",
  },
  openGraph: {
    ...baseOpenGraph,
    title: config.seoTitle,
    description: config.seoDescription,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: config.seoTitle,
    description: config.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* Tawk.to Script */}
      {/* <Script
      id="tawkto"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/67f9cb8ddb1039190df3796b/1iojs68d3';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
  /> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col w-full `}
      >
        <Script
          id="structured-data-brand"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: `${config.companyName}`,
              url: process.env.NEXT_PUBLIC_URL,
              logo: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
            }),
          }}
        />

        <I18nGate>
          <Header />
          <Toaster
            position="top-center"
            theme="dark"
            style={{ "--border-radius": "2px" } as React.CSSProperties}
            toastOptions={{
              style: {
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
              },
              classNames: {
                title: "!font-bold !tracking-[0.01em]",
                description: "!text-white/50",
                closeButton:
                  "!bg-[#161616] !border-white/10 !text-white/50 hover:!text-white",
                success: "!border-l-[3px] !border-l-[#FF3C00] [&_svg]:!text-[#FF3C00]",
                error: "!border-l-[3px] !border-l-red-500 [&_svg]:!text-red-500",
                info: "!border-l-[3px] !border-l-[#00C8FF] [&_svg]:!text-[#00C8FF]",
                warning: "!border-l-[3px] !border-l-amber-500 [&_svg]:!text-amber-500",
              },
            }}
          />
          <main className="flex-grow w-full min-h-screen"> {children}</main>
          {/* <ContactBox /> */}
          <Footer />
          {/* <FloatingContactButtons /> */}
          <FloatingCartButton />
          <BackToTopButton />
          <FlyToCartLayer />
        </I18nGate>
      </body>
    </html>
  );
}
