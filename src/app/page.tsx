import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { WhyDifferent } from "@/components/sections/why-different";
import { Chapters } from "@/components/sections/chapters";
import { Quotes } from "@/components/sections/quotes";
import { Reviews } from "@/components/sections/reviews";
import { Gallery } from "@/components/sections/gallery";
import { Author } from "@/components/sections/author";
import { FAQ } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhyDifferent />
        <Author />
        <Chapters />
        <Quotes />
        <Reviews />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
