import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

/**
 * Gallery. Uses the real cover now; drop additional photos into
 * /public/images and add them to `images` below (mockups, launch photos,
 * behind-the-scenes). Placeholder tiles fill the grid until you do.
 */
const images = [
  { src: "/images/gallery-1.jpeg", alt: "THE ILLUSION and THE REALITY — both covers" },
  { src: "/images/gallery-2.jpeg", alt: "THE ILLUSION cover in candlelight" },
  { src: "/images/gallery-3.jpeg", alt: "THE REALITY cover" },
  { src: "/images/gallery-4.jpeg", alt: "The two-sided book open on a desk" },
  { src: "/images/cover.jpg", alt: "THE ILLUSION cover art" },
];

export function Gallery() {
  const tiles = [...images];
  while (tiles.length < 6) {
    tiles.push({ src: "", alt: "" });
  }

  return (
    <section id="gallery" className="py-section">
      <Container>
        <SectionHeading eyebrow="The object" title="Gallery" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {tiles.map((img, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="aspect-[3/4] overflow-hidden rounded-lg border border-paper/10 bg-ink-soft">
                {img.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <span className="font-body text-xs uppercase tracking-[0.2em] text-paper/25">
                      Photo
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  );
}
