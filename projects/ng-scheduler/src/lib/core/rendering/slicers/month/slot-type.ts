import { DateRange } from '../../../models/date-range.model'
import { slotType } from '../../../models/slot.model'

/**
 * Determines the slot type based on whether the event extends beyond the week boundaries.
 * 
 * @returns
 * - 'full': Event starts and ends within this week
 * - 'first': Event starts this week but continues into next week(s)
 * - 'last': Event started in previous week(s) and ends this week
 * - 'middle': Event spans across this entire week (started before, ends after)
 */
export function determineSlotType(eventRange: DateRange, weekRange: DateRange): slotType {
  const startsBeforeWeek = eventRange.start < weekRange.start
  const endsAfterWeek = eventRange.end > weekRange.end

  if (startsBeforeWeek && endsAfterWeek) return 'middle'
  if (startsBeforeWeek) return 'last'
  if (endsAfterWeek) return 'first'
  return 'full'
}
