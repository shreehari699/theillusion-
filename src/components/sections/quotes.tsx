import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { quotes } from "@/content/book";

export function Quotes() {
  return (
    <section id="quotes" className="py-section">
      <Container>
        <SectionHeading eyebrow="From the pages" title="Powerful quotes" />
        <div className="grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-center rounded-lg border border-paper/10 bg-ink-soft/40 p-10">
                <blockquote className="text-balance font-display text-xl italic leading-relaxed text-paper/90">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                {q.attribution && (
                  <figcaption className="mt-4 font-body text-xs uppercase tracking-[0.2em] text-gold">
                    {q.attribution}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
