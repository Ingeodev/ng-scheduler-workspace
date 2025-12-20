import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth
} from 'date-fns';

/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
}

/**
 * Represents a week (row) in the calendar grid
 */
export interface CalendarWeek {
  days: CalendarDay[];
}

/**
 * Generates a calendar grid for a given month with padding days from adjacent months.
 * The grid always starts on Sunday and includes complete weeks.
 * 
 * @param date - Any date within the month to generate the calendar for
 * @returns An array of weeks, where each week contains 7 days
 * 
 * @example
 * ```typescript
 * const calendar = getMonthCalendarGrid(new Date(2024, 0, 15)); // January 2024
 * // Returns 5 weeks with days from Dec 31, 2023 to Feb 3, 2024
 * ```
 */
export function getMonthCalendarGrid(date: Date): CalendarWeek[] {
  // Get the first and last day of the month
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  // Get the start of the week containing the first day of the month (Sunday)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  // Get the end of the week containing the last day of the month (Saturday)
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Get all days in the calendar range
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Map days to CalendarDay objects
  const calendarDays: CalendarDay[] = allDays.map(day => ({
    date: day,
    day: day.getDate(),
    isCurrentMonth: isSameMonth(day, date),
    isPreviousMonth: day < monthStart,
    isNextMonth: day > monthEnd,
  }));

  // Group days into weeks (7 days per week)
  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push({
      days: calendarDays.slice(i, i + 7)
    });
  }

  return weeks;
}

/**
 * Represents a single day in the week view
 */
export interface WeekDay {
  date: Date;           // Date at 00:00:00
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  dayName: string;      // 'Sun', 'Mon', etc.
  dayNumber: number;    // 1-31
  isToday: boolean;     // If this day is today
}

/**
 * Represents a 30-minute time slot in the week view
 */
export interface TimeSlot {
  date: Date;           // Full date with time (hour:minute:00)
  hour: number;         // 0-23
  minute: number;       // 0 or 30
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  isToday: boolean;     // If this slot is today
  timeLabel: string;    // e.g., "09:00", "09:30"
}

/**
 * Generates an array of 7 days for the week containing the given date.
 * Week starts on Sunday.
 * 
 * @param date - Any date within the target week
 * @returns Array of 7 WeekDay objects (Sunday to Saturday)
 * 
 * @example
 * ```typescript
 * const weekDays = getWeekDays(new Date(2024, 0, 15)); // January 15, 2024 (Monday)
 * // Returns 7 days from Sunday Jan 14 to Saturday Jan 20
 * ```
 */
export function getWeekDays(date: Date): WeekDay[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });     // Saturday

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days.map(day => {
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    return {
      date: dayDate,
      dayOfWeek: day.getDay(),
      dayName: dayNames[day.getDay()],
      dayNumber: day.getDate(),
      isToday: dayDate.getTime() === today.getTime()
    };
  });
}

/**
 * Generates a 2D array of time slots for a week.
 * Each day has 48 slots (24 hours × 2 slots per hour = 30-minute intervals).
 * 
 * @param date - Any date within the target week
 * @returns 2D array [7 days][48 time slots per day]
 * 
 * @example
 * ```typescript
 * const slots = getWeekTimeSlots(new Date(2024, 0, 15));
 * // Returns array of 7 days, each with 48 time slots from 00:00 to 23:30
 * ```
 */
export function getWeekTimeSlots(date: Date): TimeSlot[][] {
  const weekDays = getWeekDays(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return weekDays.map(weekDay => {
    const slots: TimeSlot[] = [];

    // Generate 48 slots (24 hours × 2)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(weekDay.date);
        slotDate.setHours(hour, minute, 0, 0);

        const dayDate = new Date(slotDate);
        dayDate.setHours(0, 0, 0, 0);

        slots.push({
          date: slotDate,
          hour,
          minute,
          dayOfWeek: weekDay.dayOfWeek,
          isToday: dayDate.getTime() === today.getTime(),
          timeLabel: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }

    return slots;
  });
}
