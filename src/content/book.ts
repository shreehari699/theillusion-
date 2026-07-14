import type { Chapter, Quote, Review } from "@/types";

/**
 * REAL book structure, transcribed from the manuscript (Publishing Bible v1.0).
 * The tête-bêche architecture: THE ILLUSION side and THE REALITY side converge
 * through THE THRESHOLD at the shared Chapter 15, "Zero Degrees of Ordinary".
 * These titles are locked — do not alter.
 */
export const chapters: Chapter[] = [
  // THE ILLUSION side
  { side: "ILLUSION", number: "I", title: "The Actor Who Forgot His Name" },
  { side: "ILLUSION", number: "II", title: "The Man Who Swallowed the Storm" },
  { side: "ILLUSION", number: "III", title: "The City of Clocks" },
  { side: "ILLUSION", number: "IV", title: "The Map With No Territory" },
  { side: "ILLUSION", number: "V", title: "The Mirror Market" },
  { side: "ILLUSION", number: "VI", title: "The Collector of Sunsets" },
  // THE THRESHOLD
  { side: "SHARED", number: "—", title: "The Room Between Darkness" },
  // SHARED CENTER
  { side: "SHARED", number: "15", title: "Zero Degrees of Ordinary" },
  // THE REALITY side
  { side: "REALITY", number: "I", title: "The Empty Chair" },
  { side: "REALITY", number: "II", title: "The River That Forgot the Sea" },
  { side: "REALITY", number: "III", title: "The Garden Nobody Waters" },
  { side: "REALITY", number: "IV", title: "Two Strangers on a Train" },
  { side: "REALITY", number: "V", title: "The Last Letter" },
  { side: "REALITY", number: "VI", title: "The Loudest Room" },
  { side: "REALITY", number: "VII", title: "The Man Who Stopped Asking Why" },
];

/**
 * PLACEHOLDER quotes — replace the text with real lines you want to feature
 * from the book. Kept short and evocative; attribution optional.
 */
export const quotes: Quote[] = [
  { text: "Everything you believe is about to be questioned." },
  { text: "Two doors. The same room waits behind both." },
  { text: "You did not lose the world. You only stopped looking at it." },
  { text: "At zero degrees, illusion and reality are the same temperature." },
];

/**
 * PLACEHOLDER reviews — replace with your real faculty / student / reader
 * reviews. `verified` shows a small badge; set true only for genuine buyers.
 */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Reader Name",
    role: "Reader",
    rating: 5,
    text: "A book that rearranges how you see an ordinary day. I finished one side and immediately turned it over.",
    verified: false,
  },
  {
    id: "r2",
    name: "Faculty Name",
    role: "Faculty",
    rating: 5,
    text: "Rare to find philosophy worn this lightly. The structure isn't a gimmick — it's the argument.",
    verified: false,
  },
  {
    id: "r3",
    name: "Student Name",
    role: "Student",
    rating: 4,
    text: "I've never read anything shaped like this. The two beginnings meeting in the middle stayed with me for days.",
    verified: false,
  },
];

/**
 * PLACEHOLDER long-form copy — replace with your final About / Author text.
 * Written in your voice as a starting draft, not a substitute for your words.
 */
export const aboutBook = {
  heading: "About the book",
  body: [
    "THE ILLUSION is a philosophical novel built to be read two ways. One cover opens onto THE ILLUSION; flip the book over and the other cover opens onto THE REALITY. Both paths move inward, chapter by chapter, until they meet at a single shared chapter — Zero Degrees of Ordinary — reached through a threshold called The Room Between Darkness.",
    "It is a book about the stories we mistake for our lives, and the quieter reality waiting underneath them. Fourteen fables on one side, seven on the other, and one room where they become the same.",
  ],
};

export const aboutAuthor = {
  heading: "Meet the author",
  name: "Shree Hari",
  body: [
    "Shree Hari is the author behind THE ILLUSION and the founder of Zero Degree Publications, an independent imprint built on a single idea: ideas that change perspectives.",
    "This is his debut novel — a book designed to be entered from either side, and remembered as much for the experience as for the story.",
  ],
};

export const faqs = [
  {
    q: "How does the two-sided book work?",
    a: "The book has two front covers. One opens onto THE ILLUSION, the other onto THE REALITY. Both sides read inward and meet at a shared central chapter. You can start from either cover.",
  },
  {
    q: "How is the book delivered?",
    a: "You can pay online via UPI and have the book shipped to your address, or reserve it and pay on pickup. Choose your preferred method at checkout.",
  },
  {
    q: "What payment methods are accepted?",
    a: "UPI payment via QR code for online orders, or cash on pickup for reserved orders.",
  },
  {
    q: "Can I return the book?",
    a: "Reach out through the contact section for any issue with a damaged or incorrect order and we'll make it right.",
  },
  {
    q: "Is this available as an ebook?",
    a: "The first edition launches in print. Digital editions are planned — follow along on Instagram for announcements.",
  },
];
