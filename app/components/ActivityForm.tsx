"use client";

import { useState } from "react";
import type { Activity, ActivityInput } from "@/lib/types";

export default function ActivityForm({
  activity,
  defaultName,
  holidayId,
  initialDate,
  onSave,
  onCancel,
}: {
  activity?: Activity;
  defaultName: string;
  holidayId: string;
  initialDate?: string;
  onSave: (input: ActivityInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [activityDate, setActivityDate] = useState(
    activity?.activity_date ?? initialDate ?? ""
  );
  const [activityTime, setActivityTime] = useState(activity?.activity_time ?? "");
  const [location, setLocation] = useState(activity?.location ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        activity_date: activityDate,
        activity_time: activityTime,
        location: location.trim(),
        added_by: activity?.added_by ?? defaultName,
        holiday_id: activity?.holiday_id ?? holidayId,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          {activity ? "Edit activity" : "Add activity"}
        </h2>

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Title
          <input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Visit the beach"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-zinc-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any details..."
            rows={2}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1 text-sm font-medium text-zinc-700">
            Date
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
            />
          </label>
          <label className="flex-1 text-sm font-medium text-zinc-700">
            Time
            <input
              type="time"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
            />
          </label>
        </div>

        <label className="mt-3 block text-sm font-medium text-zinc-700">
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Harbour front"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || saving}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
