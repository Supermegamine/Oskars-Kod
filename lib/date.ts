export function formatTime(time: string | null) {
  if (!time) return null;
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function parseDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

export function toDateStr(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateHeading(dateStr: string) {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatDateRange(startStr: string, endStr: string) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);

  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const startPart = start.toLocaleDateString(undefined, { day: "numeric" });
    const endPart = end.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${startPart} – ${endPart}`;
  }

  const startPart = start.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endPart = end.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startPart} – ${endPart}`;
}

export function getDaysInRange(startStr: string, endStr: string): string[] {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(toDateStr(d));
  }
  return days;
}

export function formatAgendaDate(dateStr: string) {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getMonthsInRange(startStr: string, endStr: string) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);

  const months: { year: number; month: number }[] = [];
  let year = start.getFullYear();
  let month = start.getMonth();

  while (year < end.getFullYear() || (year === end.getFullYear() && month <= end.getMonth())) {
    months.push({ year, month });
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return months;
}

/**
 * Returns a grid of dates for the given month (0-indexed), starting on
 * Monday, padded with leading/trailing days from adjacent months so the
 * total length is a multiple of 7.
 */
export function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  // getDay(): 0 = Sunday ... 6 = Saturday. Convert to Monday-first offset.
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - leadingDays);

  const daysUsed = leadingDays + lastOfMonth.getDate();
  const totalDays = Math.ceil(daysUsed / 7) * 7;

  const days: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }

  return days;
}
