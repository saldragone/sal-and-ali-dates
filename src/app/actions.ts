"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Rater } from "@/lib/supabase";

export async function submitRating(formData: FormData) {
  const dateId = formData.get("dateId") as string;
  const rater = formData.get("rater") as Rater;
  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string) || null;

  if (!dateId || !rater || !rating) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase
    .from("ratings")
    .upsert(
      { date_id: dateId, rater, rating, comment },
      { onConflict: "date_id,rater" },
    );

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function suggestNewDate(formData: FormData) {
  const currentDateId = formData.get("dateId") as string;

  // Mark the current date as completed
  if (currentDateId) {
    const { error: updateError } = await supabase
      .from("dates")
      .update({ status: "completed" })
      .eq("id", currentDateId);

    if (updateError) throw new Error(updateError.message);
  }

  // Pick a random unused idea
  const { data: unusedIdeas, error: ideasError } = await supabase
    .from("date_ideas")
    .select("*")
    .eq("used", false);

  if (ideasError) throw new Error(ideasError.message);

  let idea = unusedIdeas?.[Math.floor(Math.random() * (unusedIdeas?.length || 0))];

  // If we've used every idea, reset the pool (excluding the one just completed)
  if (!idea) {
    const { error: resetError } = await supabase
      .from("date_ideas")
      .update({ used: false })
      .neq("id", "");

    if (resetError) throw new Error(resetError.message);

    const { data: refreshedIdeas, error: refreshedError } = await supabase
      .from("date_ideas")
      .select("*");

    if (refreshedError) throw new Error(refreshedError.message);

    idea = refreshedIdeas?.[Math.floor(Math.random() * (refreshedIdeas?.length || 0))];
  }

  if (!idea) throw new Error("No date ideas available");

  const { error: insertError } = await supabase.from("dates").insert({
    idea_id: idea.id,
    title: idea.title,
    description: idea.description,
    scheduled_for: new Date().toISOString().slice(0, 10),
    status: "upcoming",
  });

  if (insertError) throw new Error(insertError.message);

  const { error: markUsedError } = await supabase
    .from("date_ideas")
    .update({ used: true })
    .eq("id", idea.id);

  if (markUsedError) throw new Error(markUsedError.message);

  revalidatePath("/");
}
