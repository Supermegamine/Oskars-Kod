"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Activity, ActivityInput, Holiday } from "@/lib/types";
import { formatDateRange, getMonthsInRange } from "@/lib/date";
import { useStoredName } from "../../components/NamePrompt";
import NamePrompt from "../../components/NamePrompt";
import CalendarMonth from "../../components/CalendarMonth";
import DayDetailModal from "../../components/DayDetailModal";
import ActivityForm from "../../components/ActivityForm";

export default function HolidayPage() {
  const { id } = useParams<{ id: string }>();
  const { name, saveName, loaded } = useStoredName();

  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | "new" | null>(
    null
  );

  useEffect(() => {
    loadHoliday();
    loadActivities();
  }, [id]);

  async function loadHoliday() {
    setLoading(true);
    const { data, error } = await supabase
      .from("holidays")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      setHoliday(data as Holiday);
    }
    setLoading(false);
  }

  async function loadActivities() {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("holiday_id", id);

    if (!error && data) {
      setActivities(data as Activity[]);
    }
  }

  async function handleSave(input: ActivityInput) {
    const payload = {
      title: input.title,
      description: input.description || null,
      activity_date: input.activity_date || null,
      activity_time: input.activity_time || null,
      location: input.location || null,
      added_by: input.added_by,
      holiday_id: input.holiday_id,
    };

    if (editingActivity && editingActivity !== "new") {
      await supabase.from("activities").update(payload).eq("id", editingActivity.id);
    } else {
      await supabase.from("activities").insert(payload);
    }

    setEditingActivity(null);
    setSelectedDate(null);
    await loadActivities();
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Delete "${activity.title}"?`)) return;
    await supabase.from("activities").delete().eq("id", activity.id);
    await loadActivities();
  }

  if (!loaded) return null;

  if (loading) {
    return (
      <div className="flex min-h-full flex-col bg-zinc-50 px-4 py-4">
        <p className="text-center text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!holiday) {
    return (
      <div className="flex min-h-full flex-col bg-zinc-50 px-4 py-4">
        <p className="text-center text-zinc-500">Holiday not found.</p>
        <Link href="/" className="mt-4 text-center text-zinc-900 underline">
          Back to holidays
        </Link>
      </div>
    );
  }

  const activitiesByDate = new Map<string, Activity[]>();
  for (const activity of activities) {
    if (!activity.activity_date) continue;
    if (!activitiesByDate.has(activity.activity_date)) {
      activitiesByDate.set(activity.activity_date, []);
    }
    activitiesByDate.get(activity.activity_date)!.push(activity);
  }

  const months = getMonthsInRange(holiday.start_date, holiday.end_date);
  const selectedActivities = selectedDate
    ? activitiesByDate.get(selectedDate) ?? []
    : [];

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      {!name && <NamePrompt onSave={saveName} />}

      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Holidays
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-zinc-900">{holiday.title}</h1>
        <p className="text-sm text-zinc-500">
          {formatDateRange(holiday.start_date, holiday.end_date)}
        </p>
      </header>

      <main className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-6">
          {months.map(({ year, month }) => (
            <CalendarMonth
              key={`${year}-${month}`}
              year={year}
              month={month}
              rangeStart={holiday.start_date}
              rangeEnd={holiday.end_date}
              activitiesByDate={activitiesByDate}
              onDayClick={(dateStr) => setSelectedDate(dateStr)}
            />
          ))}
        </div>
      </main>

      {selectedDate && !editingActivity && (
        <DayDetailModal
          date={selectedDate}
          activities={selectedActivities}
          onClose={() => setSelectedDate(null)}
          onEdit={(activity) => setEditingActivity(activity)}
          onDelete={handleDelete}
          onAddNew={() => setEditingActivity("new")}
        />
      )}

      {editingActivity && name && selectedDate && (
        <ActivityForm
          activity={editingActivity === "new" ? undefined : editingActivity}
          defaultName={name}
          holidayId={holiday.id}
          initialDate={selectedDate}
          onSave={handleSave}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}
