"use client";

import type { Activity } from "@/lib/types";
import { formatDateHeading } from "@/lib/date";
import ActivityCard from "./ActivityCard";

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
