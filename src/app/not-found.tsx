import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <Container className="text-center">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-gold">
          Lost between doors
        </p>
        <h1 className="mt-4 font-display text-display-lg font-bold">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-prose text-paper/60">
          The path you followed leads nowhere. Step back through the entrance.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-gold underline-offset-4 hover:underline"
        >
          Return home
        </Link>
      </Container>
    </main>
  );
}
