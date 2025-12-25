import { startOfDay, endOfDay, differenceInDays, max, min } from 'date-fns';
import { AnyEvent, isAllDayEvent, isEvent, isRecurrentEvent } from '../../models/event.model';
import { DateRange } from '../../models/date-range.model';
import { SlotModel, slotType } from '../../models/slot.model';

// ============================================================================
// TYPES
// ============================================================================

/** Configuration for slot positioning */
export interface SlotConfig {
  /** Height of each slot row in pixels */
  slotHeight: number;
  /** Vertical gap between slots in pixels */
  slotGap: number;
}

const DEFAULT_SLOT_CONFIG: SlotConfig = {
  slotHeight: 20,
  slotGap: 2
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extracts the effective date range from any event type.
 */
function getEventDateRange(event: AnyEvent): DateRange {
  if (isEvent(event) || isRecurrentEvent(event)) {
    return {
      start: startOfDay(event.start),
      end: endOfDay(event.end)
    };
  }

  if (isAllDayEvent(event)) {
    const start = startOfDay(event.date);
    const end = event.endDate ? endOfDay(event.endDate) : endOfDay(event.date);
    return { start, end };
  }

  // Fallback (should never happen with proper types)
  return { start: new Date(), end: new Date() };
}

/**
 * Determines the slot type based on whether the event extends beyond the week boundaries.
 * - 'full': Event starts and ends within this week
 * - 'first': Event starts this week but continues into next week(s)
 * - 'last': Event started in previous week(s) and ends this week
 * - 'middle': Event spans across this entire week (started before, ends after)
 */
function determineSlotType(eventRange: DateRange, weekRange: DateRange): slotType {
  const startsBeforeWeek = eventRange.start < weekRange.start;
  const endsAfterWeek = eventRange.end > weekRange.end;

  if (startsBeforeWeek && endsAfterWeek) return 'middle';
  if (startsBeforeWeek) return 'last';
  if (endsAfterWeek) return 'first';
  return 'full';
}

/**
 * Calculates the horizontal position as percentages (0-100).
 * No container dimensions needed - pure percentage-based positioning.
 */
function calculateHorizontalPosition(
  clampedStart: Date,
  clampedEnd: Date,
  weekStart: Date
): { left: number; width: number } {
  // Calculate day indices (0-6) within the week
  const startDayIndex = differenceInDays(startOfDay(clampedStart), startOfDay(weekStart));
  const endDayIndex = differenceInDays(startOfDay(clampedEnd), startOfDay(weekStart));

  // Number of days the event spans (inclusive)
  const spanDays = endDayIndex - startDayIndex + 1;

  return {
    left: (startDayIndex / 7) * 100,
    width: (spanDays / 7) * 100
  };
}

/**
 * Finds the first available row for an event without overlapping.
 * Uses a greedy algorithm tracking event end dates per row.
 */
function findAvailableRow(
  clampedStart: Date,
  clampedEnd: Date,
  rowAssignments: Map<number, Date[]>
): number {
  let rowIndex = 0;

  while (true) {
    const rowEndDates = rowAssignments.get(rowIndex) || [];
    const hasOverlap = rowEndDates.some(existingEnd => clampedStart < existingEnd);

    if (!hasOverlap) {
      rowAssignments.set(rowIndex, [...rowEndDates, clampedEnd]);
      return rowIndex;
    }
    rowIndex++;
  }
}

// ============================================================================
// MAIN SLICER FUNCTION
// ============================================================================

/**
 * Slices a collection of events into visual slots for a specific week.
 * Returns percentage-based horizontal positions (no ResizeObserver needed).
 *
 * @param events - Array of events to process (should already be filtered for the week)
 * @param weekRange - The date range of the week { start: Sunday 00:00, end: Saturday 23:59 }
 * @param config - Optional configuration for slot sizing
 * @returns Array of SlotModel with calculated positions (left/width as %, top/height as px)
 *
 * @example
 * const slots = sliceEventsByWeek(events, {
 *   start: startOfWeek(date),
 *   end: endOfWeek(date)
 * });
 * // Use in template: [style.left.%]="slot.position.left"
 */
export function sliceEventsByWeek(
  events: AnyEvent[],
  weekRange: DateRange,
  config: SlotConfig = DEFAULT_SLOT_CONFIG
): SlotModel[] {
  const slots: SlotModel[] = [];
  const rowAssignments: Map<number, Date[]> = new Map();

  for (const event of events) {
    const eventRange = getEventDateRange(event);

    // Clamp event dates to the week boundaries
    const clampedStart = max([eventRange.start, weekRange.start]);
    const clampedEnd = min([eventRange.end, weekRange.end]);

    // Calculate horizontal position as percentages
    const { left, width } = calculateHorizontalPosition(
      clampedStart,
      clampedEnd,
      weekRange.start
    );

    // Find available row (avoids overlapping)
    const rowIndex = findAvailableRow(clampedStart, clampedEnd, rowAssignments);

    // Calculate vertical position in pixels
    const top = rowIndex * (config.slotHeight + config.slotGap);

    // Determine slot type based on week boundaries
    const type = determineSlotType(eventRange, weekRange);

    // Extract event properties for the slot
    const isEditable = !event.isReadOnly && !event.isBlocked;

    slots.push({
      id: `${event.id}-${weekRange.start.getTime()}`,
      idEvent: event.id,
      start: clampedStart,
      end: clampedEnd,
      position: {
        top,
        left,
        height: config.slotHeight,
        width
      },
      zIndex: rowIndex + 1,
      type,
      color: event.color ?? '#4285f4',
      draggable: isEditable,
      resizable: isEditable
    });
  }

  return slots;
}

