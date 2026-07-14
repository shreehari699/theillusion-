import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { aboutBook } from "@/content/book";

export function About() {
  return (
    <section id="about" className="py-section">
      <Container>
        <SectionHeading eyebrow="The book" title={aboutBook.heading} />
        <div className="mx-auto max-w-prose space-y-6">
          {aboutBook.body.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-lg leading-relaxed text-paper/75">{para}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
