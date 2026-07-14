import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { aboutAuthor } from "@/content/book";

export function Author() {
  return (
    <section id="author" className="py-section">
      <Container>
        <SectionHeading eyebrow="The author" title={aboutAuthor.heading} />
        <Reveal className="mx-auto max-w-prose text-center">
          <p className="mb-6 font-display text-2xl text-gold">
            {aboutAuthor.name}
          </p>
          <div className="space-y-5">
            {aboutAuthor.body.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-paper/75">
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
