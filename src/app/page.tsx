import { supabase } from "@/lib/supabase";
import type { DateEntry, Photo, Rating } from "@/lib/supabase";
import AddDateForm from "@/components/AddDateForm";
import CutenessMeter from "@/components/CutenessMeter";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoUploader from "@/components/PhotoUploader";
import RatingForm from "@/components/RatingForm";
import SuggestButton from "@/components/SuggestButton";

export const dynamic = "force-dynamic";

function Hearts({ value }: { value: number }) {
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "" : "opacity-25 grayscale"}>
          💗
        </span>
      ))}
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

type DateWithExtras = DateEntry & { ratings: Rating[]; photos: Photo[] };

export default async function Home() {
  const { data: current } = await supabase
    .from("dates")
    .select("*, ratings(*), photos(*)")
    .eq("status", "upcoming")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<DateWithExtras>();

  const { data: history } = await supabase
    .from("dates")
    .select("*, ratings(*), photos(*)")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<DateWithExtras[]>();

  const { data: allRatings } = await supabase.from("ratings").select("rating");
  const { count: photoCount } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true });

  const salRating = current?.ratings.find((r) => r.rater === "sal");
  const aliRating = current?.ratings.find((r) => r.rater === "ali");

  const completedCount = history?.length ?? 0;
  const ratingValues = (allRatings ?? []).map((r) => r.rating);
  const avgRating =
    ratingValues.length > 0
      ? ratingValues.reduce((s, r) => s + r, 0) / ratingValues.length
      : 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-16 pt-8">
      <header className="mb-6 text-center">
        <h1 className="font-display text-3xl text-rose-500">
          Sal &amp; Ali 💘
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Plan it. Live it. Rate it. Frame it.
        </p>
      </header>

      <CutenessMeter ratings={ratingValues} photoCount={photoCount ?? 0} />

      <div className="mb-8 grid grid-cols-3 gap-2 text-center">
        {[
          [String(completedCount + (current ? 1 : 0)), "dates"],
          [avgRating ? avgRating.toFixed(1) : "—", "avg 💗"],
          [String(photoCount ?? 0), "photos"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-rose-100 bg-white/80 px-2 py-3 shadow-sm"
          >
            <p className="text-lg font-bold text-rose-500">{value}</p>
            <p className="text-xs text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {current ? (
        <section className="mb-8 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 p-5 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              Up next{" "}
              {current.scheduled_for
                ? `· ${formatDate(current.scheduled_for)}`
                : ""}
            </p>
            <h2 className="mt-1 text-xl font-bold">{current.title}</h2>
            {current.description && (
              <p className="mt-2 text-sm opacity-95">{current.description}</p>
            )}
            {current.scheduled_for && (
              <a
                href={`/calendar/${current.id}`}
                className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition active:scale-95"
              >
                📅 Add to calendar
              </a>
            )}
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

          <PhotoGrid photos={current.photos} />
          <PhotoUploader dateId={current.id} />

          <SuggestButton dateId={current.id} />
          <AddDateForm />
        </section>
      ) : (
        <section className="mb-8 space-y-3">
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/60 p-6 text-center">
            <p className="text-3xl">🌹</p>
            <p className="mt-2 text-sm text-neutral-500">
              No date on the calendar yet. Tragic. Fix it below.
            </p>
          </div>
          <AddDateForm />
          <SuggestButton />
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Our story so far
        </h3>
        <ul className="space-y-3">
          {(history ?? []).map((d) => {
            const sal = d.ratings.find((r) => r.rater === "sal");
            const ali = d.ratings.find((r) => r.rater === "ali");
            return (
              <li
                key={d.id}
                className="space-y-3 rounded-xl border border-rose-100 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold">{d.title}</h4>
                    <span className="text-xs text-neutral-400">
                      {formatDate(d.scheduled_for)}
                    </span>
                  </div>
                  {d.description && (
                    <p className="mt-1 text-sm text-neutral-500">
                      {d.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-neutral-400">Sal: </span>
                      {sal ? <Hearts value={sal.rating} /> : "—"}
                    </div>
                    <div>
                      <span className="text-neutral-400">Ali: </span>
                      {ali ? <Hearts value={ali.rating} /> : "—"}
                    </div>
                  </div>
                  <PhotoUploader dateId={d.id} compact />
                </div>
                <PhotoGrid photos={d.photos} />
              </li>
            );
          })}
          {(!history || history.length === 0) && (
            <li className="text-center text-sm text-neutral-400">
              No past dates yet — your story starts with the first one.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
