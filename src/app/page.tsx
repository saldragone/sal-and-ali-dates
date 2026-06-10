import { supabase } from "@/lib/supabase";
import type { DateEntry, Rating } from "@/lib/supabase";
import RatingForm from "@/components/RatingForm";
import SuggestButton from "@/components/SuggestButton";

export const dynamic = "force-dynamic";

function Stars({ value }: { value: number }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(value)}
      <span className="text-neutral-300 dark:text-neutral-700">
        {"★".repeat(5 - value)}
      </span>
    </span>
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function Home() {
  const { data: current } = await supabase
    .from("dates")
    .select("*")
    .eq("status", "upcoming")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<DateEntry>();

  let currentRatings: Rating[] = [];
  if (current) {
    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("date_id", current.id);
    currentRatings = data ?? [];
  }

  const { data: history } = await supabase
    .from("dates")
    .select("*, ratings(*)")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(10);

  const salRating = currentRatings.find((r) => r.rater === "sal");
  const aliRating = currentRatings.find((r) => r.rater === "ali");

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-16 pt-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Sal &amp; Ali&apos;s Dates
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track, rate, and discover your next date night
        </p>
      </header>

      {current ? (
        <section className="mb-8 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 p-5 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              Up next {current.scheduled_for ? `· ${formatDate(current.scheduled_for)}` : ""}
            </p>
            <h2 className="mt-1 text-xl font-bold">{current.title}</h2>
            <p className="mt-2 text-sm opacity-95">{current.description}</p>
          </div>

          <RatingForm
            dateId={current.id}
            rater="sal"
            label="Sal's rating"
            existingRating={salRating?.rating}
            existingComment={salRating?.comment}
          />
          <RatingForm
            dateId={current.id}
            rater="ali"
            label="Ali's rating"
            existingRating={aliRating?.rating}
            existingComment={aliRating?.comment}
          />

          <SuggestButton dateId={current.id} />
        </section>
      ) : (
        <section className="mb-8 rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700">
          No upcoming date yet.
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          History
        </h3>
        <ul className="space-y-3">
          {(history ?? []).map(
            (d: DateEntry & { ratings: Rating[] }) => {
              const sal = d.ratings.find((r) => r.rater === "sal");
              const ali = d.ratings.find((r) => r.rater === "ali");
              return (
                <li
                  key={d.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold">{d.title}</h4>
                    <span className="text-xs text-neutral-400">
                      {formatDate(d.scheduled_for)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {d.description}
                  </p>
                  <div className="mt-3 flex gap-6 text-sm">
                    <div>
                      <span className="text-neutral-400">Sal: </span>
                      {sal ? <Stars value={sal.rating} /> : "—"}
                    </div>
                    <div>
                      <span className="text-neutral-400">Ali: </span>
                      {ali ? <Stars value={ali.rating} /> : "—"}
                    </div>
                  </div>
                </li>
              );
            },
          )}
          {(!history || history.length === 0) && (
            <li className="text-center text-sm text-neutral-400">
              No past dates yet.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
