import { startOfDay, endOfDay } from 'date-fns'
import { AnyEvent, isAllDayEvent, isEvent, isRecurrentEvent } from '../../../models/event.model'
import { DateRange } from '../../../models/date-range.model'

/**
 * Extracts the effective date range from any event type.
 * Normalizes different event structures into a consistent DateRange.
 */
export function getEventDateRange(event: AnyEvent): DateRange {
  if (isEvent(event) || isRecurrentEvent(event)) {
    return {
      start: startOfDay(event.start),
      end: endOfDay(event.end)
    }
  }

  if (isAllDayEvent(event)) {
    const start = startOfDay(event.date)
    const end = event.endDate ? endOfDay(event.endDate) : endOfDay(event.date)
    return { start, end }
  }

  // Fallback (should never happen with proper types)
  return { start: new Date(), end: new Date() }
}
