import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import config from "@/config";
import { getTransporter, hasSmtpConfig } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

async function getReceiverEmail(): Promise<string> {
  const { data } = await supabase
    .from("contact_notification_config")
    .select("receiver_email")
    .eq("id", 1)
    .single();

  return data?.receiver_email || config.companyEmail;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`contact:${ip}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  try {
    const receiverEmail = await getReceiverEmail();
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"${config.companyName} - Website" <${process.env.SMTP_USER}>`,
      to: receiverEmail,
      replyTo: email,
      subject: subject ? `[Liên hệ website] ${subject}` : `[Liên hệ website] Tin nhắn mới từ ${name}`,
      text: [
        `Họ và tên: ${name}`,
        `Email: ${email}`,
        phone ? `Điện thoại: ${phone}` : null,
        subject ? `Chủ đề: ${subject}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <p><strong>Họ và tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Điện thoại:</strong> ${phone}</p>` : ""}
        ${subject ? `<p><strong>Chủ đề:</strong> ${subject}</p>` : ""}
        <p><strong>Nội dung:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
