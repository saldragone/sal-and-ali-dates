"use client";

import { useState, useTransition } from "react";
import { suggestNewDate } from "@/app/actions";

export default function SuggestButton({ dateId }: { dateId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const suggest = () =>
    startTransition(async () => {
      const formData = new FormData();
      if (dateId) formData.set("dateId", dateId);
      await suggestNewDate(formData);
      setConfirming(false);
    });

  // With no current date there's nothing to confirm — suggest right away.
  if (!dateId) {
    return (
      <button
        onClick={suggest}
        disabled={isPending}
        className="w-full rounded-xl border-2 border-dashed border-rose-300 px-4 py-3 text-sm font-semibold text-rose-500 transition active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Picking..." : "🎲 Surprise us with an idea"}
      </button>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full rounded-lg border-2 border-dashed border-rose-300 px-4 py-3 text-sm font-semibold text-rose-500 transition active:scale-[0.98]"
      >
        Done with this date — suggest a new one
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={suggest}
        disabled={isPending}
        className="flex-1 rounded-lg bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Picking..." : "Yes, suggest a new date"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-600"
      >
        Cancel
      </button>
    </div>
  );
}
