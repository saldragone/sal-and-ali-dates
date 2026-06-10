const TIERS: [number, string][] = [
  [90, "Disgustingly adorable"],
  [75, "Certified cuties"],
  [55, "Seriously smitten"],
  [35, "Warming up"],
  [1, "A spark!"],
  [0, "Rate a date to fill the meter"],
];

export default function CutenessMeter({
  ratings,
  photoCount,
}: {
  ratings: number[];
  photoCount: number;
}) {
  // Average star rating drives the meter; every photo memory adds a
  // little bonus cuteness, capped so the bar never overflows.
  const base =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length / 5) * 90
      : 0;
  const bonus = Math.min(photoCount * 2, 10);
  const percent = Math.min(Math.round(base + bonus), 100);

  const label = TIERS.find(([min]) => percent >= min)?.[1] ?? TIERS[5][1];

  return (
    <section className="mb-8 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-rose-600">
          <span className="animate-heartbeat mr-1">💗</span>
          Cuteness meter
        </p>
        <p className="text-sm font-bold text-rose-500">{percent}%</p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-rose-100">
        <div
          className="animate-meter h-full rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-rose-400">
        {label}
      </p>
    </section>
  );
}
