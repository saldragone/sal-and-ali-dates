import { supabase } from "@/lib/supabase";
import type { DateEntry } from "@/lib/supabase";

function escapeIcs(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function icsDay(dateStr: string) {
  return dateStr.replace(/-/g, "");
}

export async function GET(
  _req: Request,
  ctx: RouteContext<"/calendar/[id]">,
) {
  const { id } = await ctx.params;

  const { data: date } = await supabase
    .from("dates")
    .select("*")
    .eq("id", id)
    .maybeSingle<DateEntry>();

  if (!date || !date.scheduled_for) {
    return new Response("Date not found", { status: 404 });
  }

  // All-day event: DTEND is exclusive, so it points at the next day.
  const end = new Date(date.scheduled_for + "T00:00:00Z");
  end.setUTCDate(end.getUTCDate() + 1);
  const endDay = end.toISOString().slice(0, 10);

  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sal & Ali//Dates//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${date.id}@sal-and-ali-dates`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDay(date.scheduled_for)}`,
    `DTEND;VALUE=DATE:${icsDay(endDay)}`,
    `SUMMARY:${escapeIcs(`💘 Date night: ${date.title}`)}`,
    ...(date.description
      ? [`DESCRIPTION:${escapeIcs(date.description)}`]
      : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="date-night.ics"',
    },
  });
}
