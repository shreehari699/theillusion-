/** Shared domain types used across the site and (later) the database layer. */

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "RESERVED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "UPI" | "PICKUP";

export type UserRole = "CUSTOMER" | "ADMIN";

export interface Review {
  id: string;
  name: string;
  role: string; // e.g. "Reader", "Faculty", "Student"
  rating: number; // 1..5
  text: string;
  verified: boolean;
}

export interface Chapter {
  side: "ILLUSION" | "REALITY" | "SHARED";
  number: string; // display label, not necessarily numeric
  title: string;
}

export interface Quote {
  text: string;
  attribution?: string;
}
