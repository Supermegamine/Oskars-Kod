"use client";

import type { Activity } from "@/lib/types";
import { formatTime } from "@/lib/date";
import { getActivityColor } from "@/lib/colors";

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const time = formatTime(activity.activity_time);
  const color = getActivityColor(activity);

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border border-zinc-200 border-l-4 bg-white p-4 shadow-sm ${color.accent}`}
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          {time && (
            <span className="text-sm font-semibold text-zinc-500">{time}</span>
          )}
          <h3 className="font-medium text-zinc-900">{activity.title}</h3>
        </div>
        {activity.location && (
          <p className="mt-0.5 text-sm text-zinc-500">📍 {activity.location}</p>
        )}
        {activity.description && (
          <p className="mt-1 text-sm text-zinc-600">{activity.description}</p>
        )}
        <p className="mt-2 text-xs text-zinc-400">Added by {activity.added_by}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onEdit}
          aria-label="Edit activity"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete activity"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
