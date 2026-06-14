"use client";

import type { Activity } from "@/lib/types";
import { formatAgendaDate, formatTime, getDaysInRange } from "@/lib/date";
import { getActivityColor } from "@/lib/colors";

export default function AgendaView({
  rangeStart,
  rangeEnd,
  activitiesByDate,
  onDayClick,
}: {
  rangeStart: string;
  rangeEnd: string;
  activitiesByDate: Map<string, Activity[]>;
  onDayClick: (dateStr: string) => void;
}) {
  const days = getDaysInRange(rangeStart, rangeEnd);

  return (
    <div className="flex flex-col gap-2">
      {days.map((dateStr) => {
        const activities = activitiesByDate.get(dateStr) ?? [];

        return (
          <button
            key={dateStr}
            onClick={() => onDayClick(dateStr)}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm"
          >
            <span className="text-sm font-medium text-zinc-900">
              {formatAgendaDate(dateStr)}
            </span>
            {activities.length === 0 ? (
              <span className="text-sm text-zinc-400">No activities</span>
            ) : (
              <div className="flex flex-col gap-1">
                {activities.map((activity) => {
                  const time = formatTime(activity.activity_time);
                  return (
                    <span
                      key={activity.id}
                      className={`truncate rounded px-2 py-1 text-sm ${getActivityColor(activity).chip}`}
                    >
                      {time ? `${time} ` : ""}
                      {activity.title}
                    </span>
                  );
                })}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
