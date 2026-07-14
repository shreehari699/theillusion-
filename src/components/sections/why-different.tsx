import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { BookOpen, DoorClosed, GitMerge } from "lucide-react";

/**
 * The tête-bêche selling point, told as three ideas. The icons + short copy
 * make the unusual structure legible at a glance.
 */
const points = [
  {
    icon: DoorClosed,
    title: "Two covers, two beginnings",
    body: "The book has two front covers. One opens onto THE ILLUSION, the other onto THE REALITY. There is no wrong way in.",
  },
  {
    icon: BookOpen,
    title: "A tête-bêche design",
    body: "Flip the book over and it begins again from the other side — a physical form as deliberate as the philosophy it carries.",
  },
  {
    icon: GitMerge,
    title: "One shared destination",
    body: "Both sides read inward and meet at a single chapter — Zero Degrees of Ordinary — reached through the threshold between them.",
  },
];

export function WhyDifferent() {
  return (
    <section id="different" className="border-y border-paper/10 bg-ink-soft/40 py-section">
      <Container>
        <SectionHeading
          eyebrow="Why it's different"
          title="Unlike any novel you've held"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-lg border border-paper/10 bg-ink/40 p-8">
                <p.icon className="mb-5 h-7 w-7 text-gold" strokeWidth={1.3} />
                <h3 className="mb-3 font-display text-xl font-semibold text-paper">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-paper/65">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
