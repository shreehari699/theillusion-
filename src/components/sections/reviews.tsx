import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { ReviewsClient } from "./reviews-client";

/**
 * Live reviews section (server component). Fetches real, approved reviews
 * from the database and passes them to the client component, which also
 * shows a "Write a review" form to logged-in users.
 */
export async function Reviews() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, name, rating, review_text, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(60);

  const { data: auth } = await supabase.auth.getUser();

  return (
    <section id="reviews" className="border-y border-paper/10 bg-ink-soft/40 py-section">
      <Container>
        <SectionHeading eyebrow="Readers" title="What people are saying" />
        <ReviewsClient
          reviews={reviews ?? []}
          isLoggedIn={!!auth.user}
          defaultName={(auth.user?.user_metadata?.full_name as string) ?? ""}
        />
      </Container>
    </section>
  );
}
