"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity, ActivityInput } from "@/lib/types";
import NamePrompt, { useStoredName } from "./components/NamePrompt";
import ActivityForm from "./components/ActivityForm";
import DaySection from "./components/DaySection";

export default function Home() {
  const { name, saveName, loaded } = useStoredName();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<Activity | "new" | null>(
    null
  );

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("activity_date", { ascending: true, nullsFirst: false })
      .order("activity_time", { ascending: true, nullsFirst: false });

    if (!error && data) {
      setActivities(data as Activity[]);
    }
    setLoading(false);
  }

  async function handleSave(input: ActivityInput) {
    const payload = {
      title: input.title,
      description: input.description || null,
      activity_date: input.activity_date || null,
      activity_time: input.activity_time || null,
      location: input.location || null,
      added_by: input.added_by,
    };

    if (editingActivity && editingActivity !== "new") {
      await supabase.from("activities").update(payload).eq("id", editingActivity.id);
    } else {
      await supabase.from("activities").insert(payload);
    }

    setEditingActivity(null);
    await loadActivities();
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Delete "${activity.title}"?`)) return;
    await supabase.from("activities").delete().eq("id", activity.id);
    await loadActivities();
  }

  const groups = groupByDate(activities);

  if (!loaded) return null;

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      {!name && <NamePrompt onSave={saveName} />}

      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-zinc-900">
          🏖️ Family Holiday Planner
        </h1>
      </header>

      <main className="flex-1 px-4 py-4">
        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-zinc-500">
            No activities yet. Add the first one!
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map(([date, items]) => (
              <DaySection
                key={date ?? "unscheduled"}
                date={date}
                activities={items}
                onEdit={(activity) => setEditingActivity(activity)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setEditingActivity("new")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white shadow-lg"
        aria-label="Add activity"
      >
        +
      </button>

      {editingActivity && name && (
        <ActivityForm
          activity={editingActivity === "new" ? undefined : editingActivity}
          defaultName={name}
          onSave={handleSave}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}

function groupByDate(activities: Activity[]): [string | null, Activity[]][] {
  const map = new Map<string | null, Activity[]>();
  for (const activity of activities) {
    const key = activity.activity_date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(activity);
  }

  // Sort so unscheduled (null) appears last
  return Array.from(map.entries()).sort((a, b) => {
    if (a[0] === null) return 1;
    if (b[0] === null) return -1;
    return a[0].localeCompare(b[0]);
  });
}
