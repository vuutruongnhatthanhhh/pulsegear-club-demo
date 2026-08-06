import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createAdminClient } from "@/lib/supabaseAdmin";
import config from "@/config";
import { emailLayout, getTransporter, hasSmtpConfig } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank: "Chuyển khoản ngân hàng",
};

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "đ";

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
  if (isRateLimited(`order-notify:${ip}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { orderId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const orderId = body.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  type OrderItemRow = {
    name_vi: string;
    qty: number;
    price: number;
  };
  const items: OrderItemRow[] = order.order_items ?? [];

  try {
    const receiverEmail = await getReceiverEmail();
    const transporter = getTransporter();

    const itemsText = items
      .map((it) => `- ${it.name_vi} x${it.qty} — ${formatPrice(it.price)}`)
      .join("\n");

    const itemsHtml = items
      .map(
        (it) =>
          `<li>${it.name_vi} × ${it.qty} — ${formatPrice(it.price)}</li>`
      )
      .join("");

    await transporter.sendMail({
      from: `"${config.companyName} - Website" <${process.env.SMTP_USER}>`,
      to: receiverEmail,
      subject: `[Đơn hàng mới] #${order.id} — ${order.full_name}`,
      text: [
        `ĐƠN HÀNG MỚI #${order.id}`,
        `Khách hàng: ${order.full_name}`,
        `Điện thoại: ${order.phone}`,
        `Địa chỉ: ${order.address}`,
        order.note ? `Ghi chú: ${order.note}` : null,
        `Thanh toán: ${PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method}`,
        "",
        "Sản phẩm:",
        itemsText,
        "",
        `Tạm tính: ${formatPrice(order.subtotal)}`,
        `Phí vận chuyển: ${order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Miễn phí"}`,
        `Tổng cộng: ${formatPrice(order.total)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      html: emailLayout(`
        <p style="margin:0 0 16px; font-size:16px; font-weight:700; color:#0A0A0A;">ĐƠN HÀNG MỚI #${order.id}</p>
        <p style="margin:0 0 4px;"><strong>Khách hàng:</strong> ${order.full_name}</p>
        <p style="margin:0 0 4px;"><strong>Điện thoại:</strong> ${order.phone}</p>
        <p style="margin:0 0 4px;"><strong>Địa chỉ:</strong> ${order.address}</p>
        ${order.note ? `<p style="margin:0 0 4px;"><strong>Ghi chú:</strong> ${order.note}</p>` : ""}
        <p style="margin:0 0 16px;"><strong>Thanh toán:</strong> ${PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method}</p>
        <p style="margin:0 0 8px; font-weight:700;">Sản phẩm:</p>
        <ul style="margin:0 0 16px; padding-left:20px;">${itemsHtml}</ul>
        <p style="margin:0 0 4px;"><strong>Tạm tính:</strong> ${formatPrice(order.subtotal)}</p>
        <p style="margin:0 0 4px;"><strong>Phí vận chuyển:</strong> ${order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Miễn phí"}</p>
        <p style="margin:0; font-size:15px; font-weight:700;">Tổng cộng: ${formatPrice(order.total)}</p>
      `),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send order notification email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
