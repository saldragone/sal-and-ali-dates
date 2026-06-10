"use client";

import { useState, useTransition } from "react";
import { suggestNewDate } from "@/app/actions";

export default function SuggestButton({ dateId }: { dateId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full rounded-lg border-2 border-dashed border-rose-300 px-4 py-3 text-sm font-semibold text-rose-500 transition active:scale-[0.98] dark:border-rose-800"
      >
        Done with this date — suggest a new one
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          startTransition(async () => {
            const formData = new FormData();
            formData.set("dateId", dateId);
            await suggestNewDate(formData);
            setConfirming(false);
          })
        }
        disabled={isPending}
        className="flex-1 rounded-lg bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Picking..." : "Yes, suggest a new date"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      >
        Cancel
      </button>
    </div>
  );
}
