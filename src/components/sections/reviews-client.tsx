"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/review-actions";

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-gold text-gold" : "text-paper/20"}`} />
      ))}
    </div>
  );
}

export function ReviewsClient({
  reviews,
  isLoggedIn,
  defaultName,
}: {
  reviews: Review[];
  isLoggedIn: boolean;
  defaultName: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("rating", String(rating));
    startTransition(async () => {
      const res = await submitReview(formData);
      if (res?.error) setError(res.error);
      else {
        setDone(true);
        setShowForm(false);
      }
    });
  }

  return (
    <div>
      {/* write-a-review controls */}
      <div className="mb-8 flex justify-center">
        {done ? (
          <p className="rounded-full bg-gold/10 px-5 py-2 text-sm text-gold">
            Thank you — your review has been posted.
          </p>
        ) : isLoggedIn ? (
          <Button variant="ghost" onClick={() => setShowForm((v) => !v)}>
            <PenLine className="mr-2 h-4 w-4" />
            {showForm ? "Close" : "Write a review"}
          </Button>
        ) : (
          <Button href="/login" variant="ghost">Sign in to write a review</Button>
        )}
      </div>

      {/* the form */}
      {showForm && !done && (
        <motion.form
          action={onSubmit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mx-auto mb-10 max-w-lg overflow-hidden rounded-2xl border border-paper/10 bg-ink/40 p-6"
        >
          <div className="mb-4">
            <label className="mb-2 block text-xs uppercase tracking-wider text-paper/50">Your rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHover(i + 1)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                  aria-label={`${i + 1} stars`}
                >
                  <Star className={`h-7 w-7 transition-colors ${i < (hover || rating) ? "fill-gold text-gold" : "text-paper/25"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wider text-paper/50">Name</label>
            <input id="name" name="name" defaultValue={defaultName} required
              className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper focus:border-gold focus:outline-none" />
          </div>
          <div className="mb-4">
            <label htmlFor="review_text" className="mb-1 block text-xs uppercase tracking-wider text-paper/50">Your review</label>
            <textarea id="review_text" name="review_text" rows={4} required
              placeholder="What did you think of the book?"
              className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper placeholder-paper/30 focus:border-gold focus:outline-none" />
          </div>
          {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Posting…" : "Post review"}
          </Button>
        </motion.form>
      )}

      {/* the reviews */}
      {reviews.length === 0 ? (
        <p className="text-center text-paper/50">Be the first to review this book.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="flex h-full flex-col rounded-lg border border-paper/10 bg-ink/40 p-8"
            >
              <Stars rating={r.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-paper/75">&ldquo;{r.review_text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-2">
                <span className="font-display text-base text-paper">{r.name}</span>
                <BadgeCheck className="h-4 w-4 text-gold" aria-label="Verified reader" />
              </div>
              <span className="font-body text-xs uppercase tracking-[0.2em] text-paper/40">
                {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
