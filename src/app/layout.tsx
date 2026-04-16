import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";
import ContactBox from "@/components/contact/ContactBox";
import { baseOpenGraph } from "./shared-metadata";
import Script from "next/script";
import { Toaster } from "sonner";
import BackToTopButton from "@/components/layout/BackToTopButton";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${config.companyName}`,
    default: `${config.companyName}`,
  },
  description: config.seoDescription,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: baseOpenGraph,
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

        <Header />
        <Toaster position="top-center" richColors />
        <main className="flex-grow w-full min-h-screen"> {children}</main>
        {/* <ContactBox /> */}
        <Footer />
        {/* <FloatingContactButtons /> */}
        {/* <BackToTopButton /> */}
      </body>
    </html>
  );
}
