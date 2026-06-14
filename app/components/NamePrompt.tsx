"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "holiday-planner-name";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export function useStoredName() {
  const name = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveName = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    listeners.forEach((l) => l());
  };

  return { name, saveName, loaded: true };
}

export default function NamePrompt({
  onSave,
}: {
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSave(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          What&apos;s your name?
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          So everyone knows who suggested what.
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your name"
          className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
