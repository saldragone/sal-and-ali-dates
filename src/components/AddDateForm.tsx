"use client";

import { useState } from "react";
import { addDate } from "@/app/actions";

export default function AddDateForm() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition active:scale-[0.98]"
      >
        + Plan a date
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        try {
          await addDate(formData);
          setOpen(false);
        } finally {
          setSubmitting(false);
        }
      }}
      className="space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-neutral-700">Plan a date 💌</p>

      <input
        name="title"
        required
        placeholder="What are we doing?"
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-rose-300 focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="The plan... (optional)"
        rows={2}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-rose-300 focus:outline-none"
      />
      <input
        name="scheduledFor"
        type="date"
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-rose-300 focus:outline-none"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add date"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={submitting}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
