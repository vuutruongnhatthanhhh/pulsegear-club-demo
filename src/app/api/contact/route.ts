// app/api/contact/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

const required = (v?: string) => typeof v === "string" && v.trim().length > 0;

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, msg, company } = await req.json();

    // Honeypot chặn bot
    if (company && String(company).trim() !== "") {
      return NextResponse.json({ ok: true }); // lờ đi
    }

    if (!required(name) || !required(email) || !required(phone)) {
      return NextResponse.json(
        { ok: false, error: "Thiếu thông tin bắt buộc (name/email/phone)." },
        { status: 400 },
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || "false") === "true"; // 465 => true, 587 => false
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.FROM_EMAIL || user;
    const to = process.env.CONTACT_TO || "info@daipartners.com.vn";

    if (!host || !port || !user || !pass || !from || !to) {
      return NextResponse.json(
        { ok: false, error: "Thiếu cấu hình SMTP trong .env." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = `New contact from ${name}`;
    const html = `
      <div style="font-family:system-ui,Arial,Helvetica">
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        ${
          required(msg)
            ? `<p><strong>Message:</strong><br/>${escapeHtml(msg).replace(
                /\n/g,
                "<br/>",
              )}</p>`
            : ""
        }
        <hr/>
        <p style="color:#777;font-size:12px">This email was sent from the website contact form.</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      replyTo: email, // để anh reply thẳng cho khách
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONTACT_API_ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Gửi email thất bại." },
      { status: 500 },
    );
  }
}

// nhỏ gọn để tránh XSS trong email
function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  // Thử select có gg_map_embed trước
  let { data, error } = await supabase
    .from("contact")
    .select(
      `
      id,
      gg_map_embed,
      office:offices (
        id,
        title,
        address,
        phone,
        email,
        gg_map,
        image
      ),
      people:our_people (
        id,
        name,
        position,
        email,
        avatar
      )
    `,
    )
    .order("id", { ascending: true });

  // Nếu lỗi (thường do RLS chặn gg_map_embed hoặc field mới)
  if (error) {
    console.warn(
      "Lỗi khi lấy gg_map_embed, fallback không lấy field này:",
      error.message,
    );

    // Fallback select không có gg_map_embed
    const fallback = await supabase
      .from("contact")
      .select(
        `
        id,
        office:offices (
          id,
          title,
          address,
          phone,
          email,
          gg_map,
          image
        ),
        people:our_people (
          id,
          name,
          position,
          email,
          avatar
        )
      `,
      )
      .order("id", { ascending: true });

    if (fallback.error) {
      console.error("Fallback cũng lỗi:", fallback.error);
      return NextResponse.json(
        { error: fallback.error.message },
        { status: 500 },
      );
    }

    // Thêm gg_map_embed = null để client biết không có
    data = fallback.data.map((item: any) => ({
      ...item,
      gg_map_embed: null,
    }));
  }

  return NextResponse.json({ data });
}
