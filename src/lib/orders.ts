/**
 * Generate a friendly, unique order code like ORD-8F3K21.
 * Combines a time component (base-36 of the current ms, last 4 chars) with a
 * random 2-char suffix so two orders effectively never collide — fixing the
 * bug where duplicate 4-digit codes silently failed to save.
 */
export function generateOrderCode(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `ORD-${time}${rand}`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "Pending Verification",
  PAID: "Paid",
  RESERVED: "Reserved",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
