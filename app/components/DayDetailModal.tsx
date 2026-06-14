"use client";

import type { Activity } from "@/lib/types";
import { formatDateHeading } from "@/lib/date";
import ActivityCard from "./ActivityCard";

export default function DayDetailModal({
  date,
  activities,
  onClose,
  onEdit,
  onDelete,
  onAddNew,
}: {
  date: string;
  activities: Activity[];
  onClose: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {formatDateHeading(date)}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {activities.length === 0 ? (
            <p className="text-sm text-zinc-500">No activities yet.</p>
          ) : (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => onEdit(activity)}
                onDelete={() => onDelete(activity)}
              />
            ))
          )}
        </div>

        <button
          onClick={onAddNew}
          className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white"
        >
          + Add activity
        </button>
      </div>
    </div>
  );
}
