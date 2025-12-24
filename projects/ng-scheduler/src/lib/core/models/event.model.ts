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
 * Recurrence rule configuration
 */
export interface RecurrenceRule {
  /** Type of recurrence pattern */
  type: RecurrenceType;

  /** Interval between occurrences (e.g., 2 = every 2 days/weeks) */
  interval: number;

  /** Number of occurrences before stopping (mutually exclusive with until) */
  count?: number;

  /** End date for the recurrence pattern (mutually exclusive with count) */
  until?: Date;

  /** Days of the week for weekly recurrence (e.g., ['Mon', 'Wed', 'Fri']) */
  byDay?: DayOfWeek[];

  /** Months for yearly recurrence (e.g., [1, 6] for Jan and Jun) */
  byMonth?: number[];

  /** Days of the month for monthly recurrence (e.g., [1, 15]) */
  byMonthDay?: number[];

  /** Position in the set (e.g., [-1] for last occurrence) */
  bySetPos?: number[];
}

/**
 * Interface for recurring events
 */
export interface RecurrentEvent extends EventBase {
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
export type AnyEvent = Event | AllDayEvent | RecurrentEvent;

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
export function isRecurrentEvent(event: AnyEvent): event is RecurrentEvent {
  return event.type === 'recurrent';
}