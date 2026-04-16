// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative h-[34vh] min-h-[260px] md:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/about-banner-9.jpg)", // thay ảnh tùy ý
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            404 — Page Not Found
          </h1>
        </div>
      </section>

      {/* MAIN */}
      {/* <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <p className="text-xl text-neutral-700 leading-relaxed">
          Trang bạn yêu cầu không tồn tại hoặc đã được di chuyển.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded bg-[#033F62] px-5 py-2 text-sm font-semibold text-white hover:bg-[#012a42]"
          >
            Về trang chủ
          </Link>
          <Link
            href="/contact"
            className="rounded bg-neutral-800 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-900"
          >
            Liên hệ chúng tôi
          </Link>
          <Link
            href="/knowledge-center"
            className="rounded border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Knowledge Center
          </Link>
        </div>
      </section> */}
    </div>
  );
}
