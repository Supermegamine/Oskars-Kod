"use client";

import { useState } from "react";
import type { Holiday, HolidayInput } from "@/lib/types";

export default function HolidayForm({
  holiday,
  defaultName,
  onSave,
  onCancel,
}: {
  holiday?: Holiday;
  defaultName: string;
  onSave: (input: HolidayInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(holiday?.title ?? "");
  const [startDate, setStartDate] = useState(holiday?.start_date ?? "");
  const [endDate, setEndDate] = useState(holiday?.end_date ?? "");
  const [saving, setSaving] = useState(false);

  const invalidRange = Boolean(startDate && endDate && endDate < startDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate || invalidRange) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        start_date: startDate,
        end_date: endDate,
        added_by: holiday?.added_by ?? defaultName,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          {holiday ? "Edit holiday" : "Add holiday"}
        </h2>

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Title
          <input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer in Greece"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <div className="mt-3 flex gap-3">
          <label className="flex-1 text-sm font-medium text-zinc-700">
            Start date
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
            />
          </label>
          <label className="flex-1 text-sm font-medium text-zinc-700">
            End date
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
            />
          </label>
        </div>

        {invalidRange && (
          <p className="mt-2 text-sm text-red-600">
            End date must be on or after the start date.
          </p>
        )}

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
            disabled={!title.trim() || !startDate || !endDate || invalidRange || saving}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
