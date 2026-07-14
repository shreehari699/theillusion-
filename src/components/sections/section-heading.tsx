import { Reveal } from "@/components/motion/reveal";

/**
 * Consistent section header: a gold eyebrow label + large display title.
 * Keeps every section visually related without repeating markup.
 */
export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal className="mb-12 text-center">
      <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 className="text-balance font-display text-display-md font-bold text-paper">
        {title}
      </h2>
    </Reveal>
  );
}
