import { max, min } from 'date-fns'
import { AnyEvent } from '../../../models/event.model'
import { DateRange } from '../../../models/date-range.model'
import { SlotModel } from '../../../models/slot.model'
import { SlotConfig, DEFAULT_SLOT_CONFIG } from './slot-config'
import { getEventDateRange } from './event-date-range'
import { determineSlotType } from './slot-type'
import { calculateHorizontalPosition, findAvailableRow, PlacedEventRange } from './slot-positioning'


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
 * })
 * // Use in template: [style.left.%]="slot.position.left"
 */
export function sliceEventsByWeek(
  events: AnyEvent[],
  weekRange: DateRange,
  config: SlotConfig = DEFAULT_SLOT_CONFIG
): SlotModel[] {
  const slots: SlotModel[] = []
  const rowAssignments: Map<number, PlacedEventRange[]> = new Map()

  for (const event of events) {
    const eventRange = getEventDateRange(event)

    // Clamp event dates to the week boundaries
    const clampedStart = max([eventRange.start, weekRange.start])
    const clampedEnd = min([eventRange.end, weekRange.end])

    // Calculate horizontal position as percentages
    const { left, width } = calculateHorizontalPosition(
      clampedStart,
      clampedEnd,
      weekRange.start
    )

    // Find available row (avoids overlapping)
    const rowIndex = findAvailableRow(clampedStart, clampedEnd, rowAssignments)

    // Calculate vertical position in pixels
    const top = rowIndex * (config.slotHeight + config.slotGap)

    // Determine slot type based on week boundaries
    const type = determineSlotType(eventRange, weekRange)

    // Extract event properties for the slot
    const isEditable = !event.isReadOnly && !event.isBlocked

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
      color: event.color ?? '',
      draggable: isEditable,
      resizable: isEditable
    })
  }

  return slots
}
