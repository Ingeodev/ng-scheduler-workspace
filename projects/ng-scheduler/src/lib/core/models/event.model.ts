/**
 * Base interface for all event types in the scheduler.
 * Provides common properties shared across all event variations.
 */
export interface EventBase {
  /** Unique identifier for the event */
  id: string;

  /** Foreign key: ID of the resource this event belongs to (optional) */
  resourceId?: string;

  /** Display title of the event */
  title: string;

  /** Additional description or notes for the event */
  description?: string;

  /** Tags for filtering and styling */
  tags?: string[];

  /** Event color (overrides resource color if set) */
  color?: string;

  /** If true, the event cannot be edited */
  isReadOnly?: boolean;

  /** If true, the event is visually blocked (e.g., maintenance) */
  isBlocked?: boolean;

  /** Flexible user-defined data */
  metadata?: any;
}

/**
 * Interface for regular time-based events
 */
export interface Event extends EventBase {
  /** Start date and time of the event */
  start: Date;

  /** End date and time of the event */
  end: Date;

  /** Event type discriminator */
  type: 'event';

  /** If true, this is an instance generated from a RecurrentEventModel */
  isRecurrenceInstance?: boolean;

  /** ID of the parent RecurrentEventModel */
  parentRecurrenceId?: string;

  /** Original date of occurrence from the recurrence rule */
  recurrenceDate?: Date;
}

/**
 * Interface for all-day events
 */
export interface AllDayEvent extends EventBase {
  /** 
   * Date for the all-day event
   * For multi-day events, this represents the start date
   */
  date: Date;

  /**
   * Optional end date for multi-day all-day events
   * If not provided, the event is a single-day event
   */
  endDate?: Date;

  /** Event type discriminator */
  type: 'all-day';
}

/**
 * Recurrence types supported by the scheduler
 */
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Days of the week for recurrence rules
 */
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

/**
 * Recurrence rule configuration compatible with RFC 5545 (iCalendar)
 * 
 * @example
 * // Every Monday for 10 weeks
 * { type: 'weekly', interval: 1, byDay: ['Mon'], count: 10 }
 * 
 * // Last Friday of each month until end of year
 * { type: 'monthly', interval: 1, byDay: ['Fri'], bySetPos: [-1], until: new Date('2025-12-31') }
 * 
 * @important At least one of `count` or `until` must be defined to prevent infinite recurrences
 * @important `count` and `until` are mutually exclusive - only one should be set
 */
export interface RecurrenceRule {
  /** Type of recurrence pattern */
  type: RecurrenceType;

  /** 
   * Interval between occurrences (e.g., 2 = every 2 days/weeks)
   * @minimum 1
   * @default 1
   */
  interval: number;

  /** 
   * Number of occurrences before stopping
   * Mutually exclusive with `until` - only one should be defined
   * @minimum 1
   * @example 10 // Event repeats 10 times
   */
  count?: number;

  /** 
   * End date for the recurrence pattern
   * Mutually exclusive with `count` - only one should be defined
   * @example new Date('2025-12-31') // Event repeats until Dec 31, 2025
   */
  until?: Date;

  /** 
   * Days of the week for weekly/monthly recurrence
   * @example ['Mon', 'Wed', 'Fri'] // Every Monday, Wednesday, and Friday
   */
  byDay?: DayOfWeek[];

  /** 
   * Months for yearly recurrence (1-12)
   * @example [1, 6, 12] // January, June, and December
   */
  byMonth?: number[];

  /** 
   * Days of the month for monthly recurrence (1-31, or negative for end of month)
   * @example [1, 15] // 1st and 15th of each month
   * @example [-1] // Last day of the month
   */
  byMonthDay?: number[];

  /** 
   * Position in the set (positive or negative)
   * Used with byDay to specify nth occurrence
   * @example [-1] // Last occurrence (e.g., last Friday of month)
   * @example [1, 3] // First and third occurrence
   */
  bySetPos?: number[];

  /** 
   * First day of the week for weekly recurrences
   * Affects calculations when using bySetPos with weekly patterns
   * @default 'Mon'
   * @example 'Sun' // Week starts on Sunday
   */
  weekStart?: DayOfWeek;

  /** 
   * Hours of the day for the recurrence (0-23)
   * Advanced: For events that repeat multiple times per day
   * @example [9, 14, 18] // 9am, 2pm, and 6pm each day
   */
  byHour?: number[];

  /** 
   * Minutes of the hour for the recurrence (0-59)
   * Advanced: For precise timing control
   * @example [0, 30] // On the hour and half-hour
   */
  byMinute?: number[];
}

/**
 * Interface for recurring events
 */
export interface RecurrentEventModel extends EventBase {
  /** Start date and time of the first occurrence */
  start: Date;

  /** End date and time of the first occurrence */
  end: Date;

  /** Recurrence rule defining the pattern */
  recurrenceRule: RecurrenceRule;

  /** Specific dates to exclude from the recurrence pattern */
  recurrenceExceptions?: Date[];

  /** Event type discriminator */
  type: 'recurrent';
}

/**
 * Union type representing any event type
 */
export type AnyEvent = Event | AllDayEvent | RecurrentEventModel;

/**
 * Type guard to check if an event is a regular Event
 */
export function isEvent(event: AnyEvent): event is Event {
  return event.type === 'event';
}

/**
 * Type guard to check if an event is an AllDayEvent
 */
export function isAllDayEvent(event: AnyEvent): event is AllDayEvent {
  return event.type === 'all-day';
}

/**
 * Type guard to check if an event is a RecurrentEvent
 */
export function isRecurrentEvent(event: AnyEvent): event is RecurrentEventModel {
  return event.type === 'recurrent';
}