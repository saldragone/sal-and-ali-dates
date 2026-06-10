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
      className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm"
    >
      <input type="hidden" name="dateId" value={dateId} />
      <input type="hidden" name="rater" value={rater} />
      <input type="hidden" name="rating" value={rating} />

      <p className="mb-2 text-sm font-semibold text-neutral-700">{label}</p>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((heart) => (
          <button
            key={heart}
            type="button"
            aria-label={`${heart} heart${heart > 1 ? "s" : ""}`}
            onClick={() => setRating(heart)}
            onMouseEnter={() => setHover(heart)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl leading-none transition-transform active:scale-90"
          >
            <span
              className={
                (hover || rating) >= heart
                  ? "grayscale-0"
                  : "opacity-30 grayscale"
              }
            >
              💗
            </span>
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        defaultValue={existingComment ?? ""}
        placeholder="Any notes about this date? (optional)"
        rows={2}
        className="mb-3 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-rose-300 focus:outline-none"
      />

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
      >
        {submitting ? "Saving..." : done ? "Saved 💕" : "Save rating"}
      </button>
    </form>
  );
}
