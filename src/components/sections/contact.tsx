import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Contact + social. Instagram follow block per the brief. The contact form
 * posts to a Server Action in the commerce layer; for now the email + IG
 * links are fully live so people can reach you immediately.
 */
export function Contact() {
  return (
    <section id="contact" className="py-section">
      <Container>
        <SectionHeading eyebrow="Stay connected" title="Contact & follow" />

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-lg border border-paper/10 bg-ink-soft/40 p-8">
              <Instagram className="mb-4 h-7 w-7 text-gold" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-paper">Follow the journey</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper/65">
                The journey doesn&apos;t end after the book. Follow along as new
                books, ideas, and projects take shape.
              </p>
              <Link
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-body text-sm text-gold hover:underline"
              >
                {siteConfig.instagramHandle}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-lg border border-paper/10 bg-ink-soft/40 p-8">
              <Mail className="mb-4 h-7 w-7 text-gold" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-paper">Get in touch</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper/65">
                Questions about your order, business enquiries, or just want to
                say hello — send an email and it reaches us directly.
              </p>
              <div className="mt-5">
                <Button href={`mailto:${siteConfig.contactEmail}`} variant="ghost">
                  {siteConfig.contactEmail}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
