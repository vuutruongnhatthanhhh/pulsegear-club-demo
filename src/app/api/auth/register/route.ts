import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { getTransporter, hasSmtpConfig, emailLayout, emailButtonHtml } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";
import config from "@/config";

function confirmSignupEmailHtml(fullName: string, actionLink: string) {
  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">Xin chào ${fullName || ""},</h2>
    <p style="color:#444; line-height:1.6;">
      Cảm ơn bạn đã đăng ký tài khoản tại PULSEGEAR.CLUB. Vui lòng nhấn vào nút bên dưới để xác nhận email và kích hoạt tài khoản.
    </p>
    ${emailButtonHtml(actionLink, "XÁC NHẬN EMAIL")}
    <p style="color:#999; font-size:12px; line-height:1.6;">
      Nếu bạn không tạo tài khoản này, có thể bỏ qua email này.
    </p>
  `);
}

function confirmSignupEmailText(fullName: string, actionLink: string) {
  return `Xin chào ${fullName || ""},\n\nCảm ơn bạn đã đăng ký tài khoản tại PULSEGEAR.CLUB. Vui lòng mở liên kết sau để xác nhận email và kích hoạt tài khoản:\n${actionLink}\n\nNếu bạn không tạo tài khoản này, có thể bỏ qua email này.`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { fullName?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: `${request.nextUrl.origin}/`,
    },
  });

  if (error) {
    const alreadyRegistered = /already.*registered|already.*exists/i.test(error.message);
    return NextResponse.json(
      { error: alreadyRegistered ? "already_registered" : "server_error" },
      { status: alreadyRegistered ? 409 : 500 },
    );
  }

  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  // Seed the profiles row with the name given at signup — kept separate from
  // auth user_metadata, which Google OAuth overwrites on every sign-in.
  if (data.user) {
    await admin.from("profiles").upsert({ id: data.user.id, full_name: fullName });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${config.companyName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Xác nhận email đăng ký - PULSEGEAR.CLUB",
      text: confirmSignupEmailText(fullName, actionLink),
      html: confirmSignupEmailHtml(fullName, actionLink),
    });
  } catch (err) {
    console.error("Failed to send signup confirmation email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
