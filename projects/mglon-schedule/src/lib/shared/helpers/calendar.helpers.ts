import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  areIntervalsOverlapping,
  startOfDay,
  endOfDay
} from 'date-fns';
import { ViewMode } from '../../core/models/config-schedule';
import { AnyEvent, isAllDayEvent, isEvent, isRecurrentEvent } from '../../core/models/event.model';
import { DateRange } from '../../core/models/date-range.model';

// ============================================================================
// MONTH VIEW - Interfaces & Functions
// ============================================================================

/** Represents a single day cell in the month grid */
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
}

/** Represents a week row in the month grid */
export interface CalendarWeek {
  days: CalendarDay[];
}

/**
 * Generates a complete month calendar grid with padding days from adjacent months.
 * Always starts on Sunday and includes complete weeks (5-6 weeks total).
 *
 * @example
 * getMonthCalendarGrid(new Date(2024, 0, 15)) // January 2024
 * // Returns 5 weeks: Dec 31, 2023 → Feb 3, 2024
 */
export function getMonthCalendarGrid(date: Date): CalendarWeek[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const calendarDays: CalendarDay[] = allDays.map(day => ({
    date: day,
    day: day.getDate(),
    isCurrentMonth: isSameMonth(day, date),
    isPreviousMonth: day < monthStart,
    isNextMonth: day > monthEnd,
  }));

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push({ days: calendarDays.slice(i, i + 7) });
  }

  return weeks;
}

// ============================================================================
// WEEK VIEW - Interfaces & Functions
// ============================================================================

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Represents a single day in the week view header */
export interface WeekDay {
  date: Date;
  dayOfWeek: number;   // 0-6 (Sunday-Saturday)
  dayName: string;     // 'Sun', 'Mon', etc.
  dayNumber: number;   // 1-31
  isToday: boolean;
}

/** Represents a 30-minute time slot in the week/day grid */
export interface TimeSlot {
  date: Date;
  hour: number;        // 0-23
  minute: number;      // 0 or 30
  dayOfWeek: number;   // 0-6 (Sunday-Saturday)
  isToday: boolean;
  timeLabel: string;   // "09:00", "09:30"
}

/**
 * Generates the 7 days of the week containing the given date.
 * Week starts on Sunday.
 *
 * @example
 * getWeekDays(new Date(2024, 0, 15)) // Monday, Jan 15
 * // Returns: Sun Jan 14 → Sat Jan 20
 */
export function getWeekDays(date: Date): WeekDay[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return days.map(day => {
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    return {
      date: dayDate,
      dayOfWeek: day.getDay(),
      dayName: DAY_NAMES[day.getDay()],
      dayNumber: day.getDate(),
      isToday: dayDate.getTime() === today.getTime()
    };
  });
}

/**
 * Generates a 2D matrix of time slots for a week.
 * Each day contains 48 slots (24h × 2 = 30-minute intervals).
 *
 * @returns TimeSlot[7 days][48 slots per day]
 */
export function getWeekTimeSlots(date: Date): TimeSlot[][] {
  const weekDays = getWeekDays(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return weekDays.map(weekDay => {
    const slots: TimeSlot[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(weekDay.date);
        slotDate.setHours(hour, minute, 0, 0);

        slots.push({
          date: slotDate,
          hour,
          minute,
          dayOfWeek: weekDay.dayOfWeek,
          isToday: weekDay.isToday,
          timeLabel: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }

    return slots;
  });
}

// ============================================================================
// VIEW RANGE - Functions for calculating visible date ranges
// ============================================================================

/**
 * Calculates the visible date range based on view mode.
 * Used to filter which events should be displayed.
 */
export function getViewRange(date: Date, viewMode: ViewMode): DateRange {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  switch (viewMode) {
    case 'month': {
      const monthStart = startOfMonth(normalizedDate);
      const monthEnd = endOfMonth(normalizedDate);
      return {
        start: startOfWeek(monthStart, { weekStartsOn: 0 }),
        end: endOfWeek(monthEnd, { weekStartsOn: 0 })
      };
    }

    case 'week': {
      return {
        start: startOfWeek(normalizedDate, { weekStartsOn: 0 }),
        end: endOfWeek(normalizedDate, { weekStartsOn: 0 })
      };
    }

    case 'day':
    case 'resource': {
      const endOfDay = new Date(normalizedDate);
      endOfDay.setHours(23, 59, 59, 999);
      return { start: normalizedDate, end: endOfDay };
    }

    case 'list': {
      return {
        start: startOfMonth(normalizedDate),
        end: endOfMonth(normalizedDate)
      };
    }

    default:
      return { start: normalizedDate, end: normalizedDate };
  }
}

// ============================================================================
// EVENT FILTERING - Functions to check event visibility
// ============================================================================

/**
 * Checks if an event overlaps with a given date range.
 * Handles standard events, all-day events, and recurrent events.
 */
export function isEventInRange(event: AnyEvent, range: DateRange): boolean {
  if (isEvent(event) || isRecurrentEvent(event)) {
    return event.start <= range.end && event.end >= range.start;
  }

  if (isAllDayEvent(event)) {
    const eventStart = startOfDay(event.date);
    const eventEnd = event.endDate ? endOfDay(event.endDate) : endOfDay(event.date);

    return eventStart <= range.end && eventEnd >= range.start;
  }

  return false;
}
