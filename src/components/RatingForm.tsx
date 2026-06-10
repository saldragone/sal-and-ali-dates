"use client";

import { useState } from "react";
import { submitRating } from "@/app/actions";
import type { Rater } from "@/lib/supabase";

export default function RatingForm({
  dateId,
  rater,
  label,
  existingRating,
  existingComment,
}: {
  dateId: string;
  rater: Rater;
  label: string;
  existingRating?: number;
  existingComment?: string | null;
}) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        await submitRating(formData);
        setSubmitting(false);
        setDone(true);
      }}
      className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <input type="hidden" name="dateId" value={dateId} />
      <input type="hidden" name="rater" value={rater} />
      <input type="hidden" name="rating" value={rating} />

      <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        {label}
      </p>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl leading-none transition-transform active:scale-90"
          >
            <span
              className={
                (hover || rating) >= star
                  ? "text-amber-400"
                  : "text-neutral-300 dark:text-neutral-700"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        defaultValue={existingComment ?? ""}
        placeholder="Any notes about this date? (optional)"
        rows={2}
        className="mb-3 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
      />

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
      >
        {submitting ? "Saving..." : done ? "Saved ✓" : "Save rating"}
      </button>
    </form>
  );
}
