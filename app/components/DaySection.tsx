"use client";

import type { Activity } from "@/lib/types";
import ActivityCard from "./ActivityCard";

function formatDateHeading(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DaySection({
  date,
  activities,
  onEdit,
  onDelete,
}: {
  date: string | null;
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {date ? formatDateHeading(date) : "Unscheduled"}
      </h2>
      <div className="flex flex-col gap-2">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onEdit={() => onEdit(activity)}
            onDelete={() => onDelete(activity)}
          />
        ))}
      </div>
    </section>
  );
}
