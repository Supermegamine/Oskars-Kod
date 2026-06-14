// A palette of distinct, friendly colors used to visually tell activities
// apart in the calendar, similar to Google Calendar's event colors.
const ACTIVITY_COLORS = [
  { chip: "bg-blue-100 text-blue-800", accent: "border-blue-400" },
  { chip: "bg-emerald-100 text-emerald-800", accent: "border-emerald-400" },
  { chip: "bg-amber-100 text-amber-800", accent: "border-amber-400" },
  { chip: "bg-rose-100 text-rose-800", accent: "border-rose-400" },
  { chip: "bg-violet-100 text-violet-800", accent: "border-violet-400" },
  { chip: "bg-cyan-100 text-cyan-800", accent: "border-cyan-400" },
  { chip: "bg-orange-100 text-orange-800", accent: "border-orange-400" },
  { chip: "bg-pink-100 text-pink-800", accent: "border-pink-400" },
];

export function getActivityColor(activity: { id: string }) {
  let hash = 0;
  for (const char of activity.id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return ACTIVITY_COLORS[hash % ACTIVITY_COLORS.length];
}
