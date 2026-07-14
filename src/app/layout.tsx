import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { LoadingScreen } from "@/components/sections/loading-screen";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "THE ILLUSION",
    "Shree Hari",
    "Zero Degree Publications",
    "philosophical novel",
    "tête-bêche book",
    "two beginnings",
  ],
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: "/images/cover.jpg", width: 868, height: 1400, alt: siteConfig.name }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/cover.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <LoadingScreen />
        <ScrollProgress />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
