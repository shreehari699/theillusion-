"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ReviewResult { error?: string; ok?: boolean }

/** Submit a live customer review. Must be logged in. */
export async function submitReview(formData: FormData): Promise<ReviewResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Please sign in to leave a review." };

  const rating = Number(formData.get("rating") ?? 0);
  const text = String(formData.get("review_text") ?? "").trim();
  const name =
    String(formData.get("name") ?? "").trim() ||
    (auth.user.user_metadata?.full_name as string) ||
    "Reader";

  if (rating < 1 || rating > 5) return { error: "Please choose a star rating." };
  if (text.length < 3) return { error: "Please write a short review." };

  const { error } = await supabase.from("reviews").insert({
    user_id: auth.user.id,
    name,
    rating,
    review_text: text,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}
