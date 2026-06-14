"use client";

import type { Activity } from "@/lib/types";
import { buildMonthGrid, toDateStr } from "@/lib/date";
import CalendarDayCell from "./CalendarDayCell";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarMonth({
  year,
  month,
  rangeStart,
  rangeEnd,
  activitiesByDate,
  onDayClick,
}: {
  year: number;
  month: number;
  rangeStart: string;
  rangeEnd: string;
  activitiesByDate: Map<string, Activity[]>;
  onDayClick: (dateStr: string) => void;
}) {
  const days = buildMonthGrid(year, month);
  const heading = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {heading}
      </h2>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-500">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const dateStr = toDateStr(date);
          const inRange = dateStr >= rangeStart && dateStr <= rangeEnd;
          const isCurrentMonth = date.getMonth() === month;

          return (
            <CalendarDayCell
              key={dateStr}
              date={date}
              inRange={inRange}
              isCurrentMonth={isCurrentMonth}
              activities={activitiesByDate.get(dateStr) ?? []}
              onClick={() => onDayClick(dateStr)}
            />
          );
        })}
      </div>
    </section>
  );
}
