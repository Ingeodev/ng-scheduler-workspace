import { addDays, differenceInDays, startOfDay } from 'date-fns'

const DAYS_IN_WEEK = 7
const PERCENTAGE_BASE = 100

/**
 * Calculates the horizontal position as percentages (0-100).
 * No container dimensions needed - pure percentage-based positioning.
 */
export function calculateHorizontalPosition(
  clampedStart: Date,
  clampedEnd: Date,
  weekStart: Date
): { left: number; width: number } {
  // Calculate day indices (0-6) within the week
  const startDayIndex = differenceInDays(startOfDay(clampedStart), startOfDay(weekStart))
  const endDayIndex = differenceInDays(startOfDay(clampedEnd), startOfDay(weekStart))

  // Number of days the event spans (inclusive)
  const spanDays = endDayIndex - startDayIndex + 1

  return {
    left: (startDayIndex / DAYS_IN_WEEK) * PERCENTAGE_BASE,
    width: (spanDays / DAYS_IN_WEEK) * PERCENTAGE_BASE
  }
}

/**
 * Represents a placed event's day range within a week for overlap checking.
 */
export interface PlacedEventRange {
  /** First day of the event (normalized to startOfDay) */
  startDay: Date
  /** Day AFTER the event ends (for exclusive end comparison) */
  exclusiveEndDay: Date
}

/**
 * Finds the first available row for an event without overlapping.
 * Uses a greedy algorithm with proper day-range intersection checking.
 * 
 * ## How overlap is determined:
 * 
 * Two events overlap if their day ranges intersect. We use half-open intervals
 * [startDay, exclusiveEndDay) for comparison:
 * 
 * ```
 * Event A: Dec 22-24  → { startDay: Dec 22, exclusiveEndDay: Dec 25 }
 * Event B: Dec 25     → { startDay: Dec 25, exclusiveEndDay: Dec 26 }
 * 
 * Intersection check: A.start < B.exclusiveEnd AND B.start < A.exclusiveEnd
 *                     Dec 22 < Dec 26 (true) AND Dec 25 < Dec 25 (false)
 *                     → NO overlap ✓
 * ```
 * 
 * @param clampedStart - Event start date (clamped to week)
 * @param clampedEnd - Event end date (clamped to week)
 * @param rowAssignments - Map of row index → array of placed event ranges
 */
export function findAvailableRow(
  clampedStart: Date,
  clampedEnd: Date,
  rowAssignments: Map<number, PlacedEventRange[]>
): number {
  let rowIndex = 0

  // Create the day range for the new event
  const newEventRange: PlacedEventRange = {
    startDay: startOfDay(clampedStart),
    exclusiveEndDay: addDays(startOfDay(clampedEnd), 1)
  }

  while (true) {
    const existingRanges = rowAssignments.get(rowIndex) || []

    // Check if new event overlaps with any existing event in this row
    // Using half-open interval intersection: A ∩ B ≠ ∅ ⟺ A.start < B.end AND B.start < A.end
    const hasOverlap = existingRanges.some(existing =>
      newEventRange.startDay < existing.exclusiveEndDay &&
      existing.startDay < newEventRange.exclusiveEndDay
    )

    if (!hasOverlap) {
      rowAssignments.set(rowIndex, [...existingRanges, newEventRange])
      return rowIndex
    }
    rowIndex++
  }
}

/**
 * Calculates the maximum number of visible rows based on container height.
 * 
 * @param containerHeight - Height of the container in pixels
 * @param slotHeight - Height of each slot row in pixels
 * @param slotGap - Vertical gap between slots in pixels
 * @returns Maximum number of full rows that fit in the container
 * 
 * @example
 * // Container of 66px with 20px slots and 2px gap = 3 rows
 * // Row 0: 0-20px, Row 1: 22-42px, Row 2: 44-64px
 * calculateMaxVisibleRows(66, 20, 2) // returns 3
 */
export function calculateMaxVisibleRows(
  containerHeight: number,
  slotHeight: number,
  slotGap: number
): number {
  if (containerHeight <= 0 || slotHeight <= 0) {
    return 0
  }

  // Each row takes: slotHeight + slotGap (except the last one doesn't need gap)
  // Formula: containerHeight >= (n * slotHeight) + ((n - 1) * slotGap)
  // Simplified: n = floor((containerHeight + slotGap) / (slotHeight + slotGap))
  const rowWithGap = slotHeight + slotGap
  return Math.floor((containerHeight + slotGap) / rowWithGap)
}
