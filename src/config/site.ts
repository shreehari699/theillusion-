/**
 * Central site configuration. Everything brand-level lives here so
 * copy, URLs, and metadata are changed in ONE place, never hardcoded per page.
 */
export const siteConfig = {
  name: "THE ILLUSION",
  publisher: "Zero Degree Publications",
  author: "Shree Hari",
  tagline: "Two Doors. One Destination.",
  subtitle: "A book with two beginnings.",
  description:
    "A philosophical novel in tête-bêche form — two beginnings that meet in a single chapter. Enter from either side.",
  url: "https://theillusion.vercel.app",
  instagram: "https://instagram.com/shreehari.builds",
  instagramHandle: "@shreehari.builds",
  contactEmail: "hello@theillusion.in",
} as const;

/** Commerce config — price, UPI payment details. Single source of truth. */
export const bookConfig = {
  price: 199, // INR
  currency: "INR",
  currencySymbol: "₹",
  upiId: "shreeharike19@oksbi",
  upiName: "Shree Hari",
  qrImage: "/images/upi-qr.jpeg",
} as const;

/** Primary navigation — order matters, mirrors the approved blueprint. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About the Book", href: "/#about" },
  { label: "Why It's Different", href: "/#different" },
  { label: "The Author", href: "/#author" },
  { label: "Chapters", href: "/#chapters" },
  { label: "Quotes", href: "/#quotes" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Gallery", href: "/#gallery" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
] as const;
