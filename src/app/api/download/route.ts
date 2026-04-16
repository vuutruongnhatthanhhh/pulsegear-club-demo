// app/api/download/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Fetch file từ nguồn
  const upstream = await fetch(url, { cache: "no-store" });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Cannot fetch file" }, { status: 502 });
  }

  // Nếu nguồn đã gửi Content-Disposition (có filename) → giữ nguyên
  const cd = upstream.headers.get("content-disposition");

  // Nếu không có, tự suy luận tên từ URL (không đổi tên tùy hứng)
  let filename = "";
  if (!cd) {
    try {
      const u = new URL(url);
      const last = u.pathname.split("/").filter(Boolean).pop() || "download";
      // Cắt query kiểu ?alt=media vẫn giữ phần tên chính
      filename = decodeURIComponent(last);
    } catch {
      filename = "download";
    }
  }

  // Trả body stream + header phù hợp
  const res = new NextResponse(upstream.body, {
    status: 200,
    headers: {
      // Giữ nguyên loại nội dung nếu có
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      // Nếu upstream đã có Content-Disposition → giữ y chang; ngược lại mới set attachment với tên suy luận
      ...(cd
        ? { "Content-Disposition": cd }
        : { "Content-Disposition": `attachment; filename="${filename}"` }),
      // Cho phép tải về từ trình duyệt
      "Cache-Control": "no-store",
    },
  });

  return res;
}
