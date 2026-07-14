import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 py-16">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="font-display text-xl text-paper">{siteConfig.name}</p>
        <p className="max-w-prose text-sm text-paper/50">{siteConfig.tagline}</p>
        <div className="flex items-center gap-5">
          <Link
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-paper/60 transition-colors hover:text-gold"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href={`mailto:${siteConfig.contactEmail}`}
            aria-label="Email"
            className="text-paper/60 transition-colors hover:text-gold"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-4 font-body text-xs text-paper/30">
          © {new Date().getFullYear()} {siteConfig.publisher}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
