"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Holiday, HolidayInput } from "@/lib/types";
import NamePrompt, { useStoredName } from "./components/NamePrompt";
import HolidayForm from "./components/HolidayForm";
import HolidayCard from "./components/HolidayCard";

export default function Home() {
  const { name, saveName, loaded } = useStoredName();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | "new" | null>(
    null
  );

  useEffect(() => {
    loadHolidays();
  }, []);

  async function loadHolidays() {
    setLoading(true);
    const { data, error } = await supabase
      .from("holidays")
      .select("*")
      .order("start_date", { ascending: true });

    if (!error && data) {
      setHolidays(data as Holiday[]);
    }
    setLoading(false);
  }

  async function handleSave(input: HolidayInput) {
    const payload = {
      title: input.title,
      start_date: input.start_date,
      end_date: input.end_date,
      added_by: input.added_by,
    };

    if (editingHoliday && editingHoliday !== "new") {
      await supabase.from("holidays").update(payload).eq("id", editingHoliday.id);
    } else {
      await supabase.from("holidays").insert(payload);
    }

    setEditingHoliday(null);
    await loadHolidays();
  }

  async function handleDelete(holiday: Holiday) {
    if (!confirm(`Delete "${holiday.title}"?`)) return;
    await supabase.from("holidays").delete().eq("id", holiday.id);
    await loadHolidays();
  }

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
        ) : holidays.length === 0 ? (
          <p className="text-center text-zinc-500">
            No holidays yet. Add the first one!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {holidays.map((holiday) => (
              <HolidayCard
                key={holiday.id}
                holiday={holiday}
                onEdit={() => setEditingHoliday(holiday)}
                onDelete={() => handleDelete(holiday)}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setEditingHoliday("new")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white shadow-lg"
        aria-label="Add holiday"
      >
        +
      </button>

      {editingHoliday && name && (
        <HolidayForm
          holiday={editingHoliday === "new" ? undefined : editingHoliday}
          defaultName={name}
          onSave={handleSave}
          onCancel={() => setEditingHoliday(null)}
        />
      )}
    </div>
  );
}
