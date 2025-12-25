import { differenceInDays, startOfDay } from 'date-fns'

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
 * Finds the first available row for an event without overlapping.
 * Uses a greedy algorithm tracking event end dates per row.
 */
export function findAvailableRow(
  clampedStart: Date,
  clampedEnd: Date,
  rowAssignments: Map<number, Date[]>
): number {
  let rowIndex = 0

  while (true) {
    const rowEndDates = rowAssignments.get(rowIndex) || []
    const hasOverlap = rowEndDates.some(existingEnd => clampedStart < existingEnd)

    if (!hasOverlap) {
      rowAssignments.set(rowIndex, [...rowEndDates, clampedEnd])
      return rowIndex
    }
    rowIndex++
  }
}
