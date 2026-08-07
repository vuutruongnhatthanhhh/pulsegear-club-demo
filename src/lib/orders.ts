import { supabase } from "./supabaseClient";
import type { CartItem } from "./cart/store";

export type PaymentMethod = "cod" | "bank";
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

export type OrderItemRecord = {
  id: number;
  name: { vi: string; en: string };
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
};

export type OrderRecord = {
  id: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  fullName: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: OrderItemRecord[];
};

type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
};

export async function createOrder(
  input: CreateOrderInput
): Promise<{ orderId: number; error?: undefined } | { orderId?: undefined; error: string }> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      payment_method: input.paymentMethod,
      full_name: input.fullName,
      phone: input.phone,
      address: input.address,
      note: input.note,
      subtotal: input.subtotal,
      shipping_fee: input.shippingFee,
      total: input.subtotal + input.shippingFee,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Không thể tạo đơn hàng" };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name_vi: item.name.vi,
      name_en: item.name.en,
      image_url: item.img,
      price: item.price,
      qty: item.qty,
      size: item.size ?? null,
      color: item.color ?? null,
    }))
  );

  if (itemsError) return { error: itemsError.message };

  return { orderId: order.id };
}

/** A customer's own order history, newest first. Scoped by RLS to auth.uid() = user_id. */
export async function getMyOrders(userId: string): Promise<OrderRecord[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    paymentMethod: row.payment_method,
    fullName: row.full_name,
    phone: row.phone,
    address: row.address,
    note: row.note,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    total: row.total,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map(
      (it: {
        id: number;
        name_vi: string;
        name_en: string;
        image_url: string;
        price: number;
        qty: number;
        size: string | null;
        color: string | null;
      }) => ({
        id: it.id,
        name: { vi: it.name_vi, en: it.name_en },
        image: it.image_url,
        price: it.price,
        qty: it.qty,
        size: it.size ?? undefined,
        color: it.color ?? undefined,
      })
    ),
  }));
}
