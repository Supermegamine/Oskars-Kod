"use client";

import type { Activity } from "@/lib/types";
import { formatTime } from "@/lib/date";
import { getActivityColor } from "@/lib/colors";

const MAX_VISIBLE_CHIPS = 5;

export default function CalendarDayCell({
  date,
  inRange,
  isCurrentMonth,
  activities,
  onClick,
}: {
  date: Date;
  inRange: boolean;
  isCurrentMonth: boolean;
  activities: Activity[];
  onClick: () => void;
}) {
  const dayNumber = date.getDate();
  const visible = activities.slice(0, MAX_VISIBLE_CHIPS);
  const remaining = activities.length - visible.length;

  return (
    <div
      onClick={inRange ? onClick : undefined}
      className={`flex flex-col gap-1 border border-zinc-200 p-1.5 ${
        inRange ? "min-h-[180px] cursor-pointer bg-white hover:bg-zinc-100" : "min-h-[60px] bg-zinc-50"
      }`}
    >
      <span
        className={`text-sm ${
          inRange
            ? isCurrentMonth
              ? "font-medium text-zinc-900"
              : "text-zinc-400"
            : "text-zinc-300"
        }`}
      >
        {dayNumber}
      </span>
      <div className="flex flex-col gap-0.5">
        {visible.map((activity) => {
          const time = formatTime(activity.activity_time);
          return (
            <span
              key={activity.id}
              className={`truncate rounded px-1.5 py-1 text-xs leading-tight ${getActivityColor(activity).chip}`}
              title={activity.title}
            >
              {time ? `${time} ` : ""}
              {activity.title}
            </span>
          );
        })}
        {remaining > 0 && (
          <span className="text-[11px] text-zinc-500">+{remaining} more</span>
        )}
      </div>
    </div>
  );
}
