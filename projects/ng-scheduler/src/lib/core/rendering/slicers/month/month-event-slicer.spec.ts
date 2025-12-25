import { sliceEventsByWeek } from './month-event-slicer'
import { AllDayEvent, Event } from '../../../models/event.model'
import { DateRange } from '../../../models/date-range.model'
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns'

describe('sliceEventsByWeek', () => {
  // Helper to create week range (Sunday start)
  const createWeekRange = (date: Date): DateRange => ({
    start: startOfDay(startOfWeek(date, { weekStartsOn: 0 })),
    end: endOfDay(endOfWeek(date, { weekStartsOn: 0 }))
  })

  // Week Dec 21-27, 2025 (Sunday Dec 21 to Saturday Dec 27)
  const christmasWeek = createWeekRange(new Date(2025, 11, 25))

  // Week Dec 28 - Jan 3 (Sunday Dec 28 to Saturday Jan 3)
  const newYearWeek = createWeekRange(new Date(2025, 11, 30))

  // Week Jan 4-10, 2026 (Sunday Jan 4 to Saturday Jan 10)
  const januaryWeek = createWeekRange(new Date(2026, 0, 5))

  // ============================================
  // Test events - using proper event types
  // ============================================

  const christmasEve: Event = {
    id: 'e3',
    title: 'Christmas Eve',
    start: new Date(2025, 11, 24, 10, 0),
    end: new Date(2025, 11, 24, 12, 0),
    color: '#f59e0b',
    type: 'event'
  }

  // Holiday Trip: Dec 26 - Jan 5 (spans 3 weeks)
  const holidayTrip: AllDayEvent = {
    id: 'e2',
    title: 'Holiday Trip',
    date: new Date(2025, 11, 26),
    endDate: new Date(2026, 0, 5),
    color: '#10b981',
    type: 'all-day'
  }

  // Multi-day event: Dec 22-24 (Mon-Wed, 3 days)
  const multiDayEvent: Event = {
    id: 'e4',
    title: 'Conference',
    start: new Date(2025, 11, 22, 9, 0),
    end: new Date(2025, 11, 24, 17, 0),
    color: '#8b5cf6',
    type: 'event'
  }

  // 5 events on Christmas Day for overflow testing
  const christmasDayEvents: Event[] = [
    { id: 'e5', title: 'Morning Call', start: new Date(2025, 11, 25, 8, 0), end: new Date(2025, 11, 25, 9, 0), color: '#ef4444', type: 'event' },
    { id: 'e6', title: 'Brunch', start: new Date(2025, 11, 25, 10, 0), end: new Date(2025, 11, 25, 11, 0), color: '#f97316', type: 'event' },
    { id: 'e7', title: 'Gift Exchange', start: new Date(2025, 11, 25, 12, 0), end: new Date(2025, 11, 25, 13, 0), color: '#22c55e', type: 'event' },
    { id: 'e8', title: 'Dinner Prep', start: new Date(2025, 11, 25, 14, 0), end: new Date(2025, 11, 25, 15, 0), color: '#3b82f6', type: 'event' },
    { id: 'e9', title: 'Family Dinner', start: new Date(2025, 11, 25, 16, 0), end: new Date(2025, 11, 25, 17, 0), color: '#8b5cf6', type: 'event' },
  ]

  describe('single-day events', () => {
    it('should create single slot for single-day event', () => {
      const slots = sliceEventsByWeek([christmasEve], christmasWeek)
      expect(slots.length).toBe(1)
      expect(slots[0].idEvent).toBe('e3')
      expect(slots[0].type).toBe('full')
    })

    it('should preserve event color in slot', () => {
      const slots = sliceEventsByWeek([christmasEve], christmasWeek)
      expect(slots[0].color).toBe('#f59e0b')
    })

    it('should generate unique slot ID with week timestamp', () => {
      const slots = sliceEventsByWeek([christmasEve], christmasWeek)
      expect(slots[0].id).toBe(`e3-${christmasWeek.start.getTime()}`)
    })
  })

  describe('multi-day events within week', () => {
    it('should create single slot for multi-day event within same week', () => {
      const slots = sliceEventsByWeek([multiDayEvent], christmasWeek)
      expect(slots.length).toBe(1)
      expect(slots[0].type).toBe('full')
    })

    it('should calculate correct width for 3-day event (Dec 22-24)', () => {
      const slots = sliceEventsByWeek([multiDayEvent], christmasWeek)
      // Dec 22-24 = Mon-Wed = 3 days = 3/7 of week = ~42.86%
      expect(slots[0].position.width).toBeCloseTo((3 / 7) * 100)
    })
  })

  describe('multi-week events', () => {
    it('should create "first" type slot in starting week (Dec 26-27)', () => {
      // Holiday Trip starts Dec 26 (Fri), week ends Dec 27 (Sat)
      // So it extends beyond the week -> "first"
      const slots = sliceEventsByWeek([holidayTrip], christmasWeek)
      expect(slots.length).toBe(1)
      expect(slots[0].type).toBe('first')
    })

    it('should create "middle" type slot in intermediate week (Dec 28 - Jan 3)', () => {
      // Holiday Trip: Dec 26 - Jan 5, newYearWeek is Dec 28 - Jan 3
      // Event starts before (Dec 26) and ends after (Jan 5) -> "middle"
      const slots = sliceEventsByWeek([holidayTrip], newYearWeek)
      expect(slots.length).toBe(1)
      expect(slots[0].type).toBe('middle')
    })

    it('should create "last" type slot in ending week (Jan 4-10)', () => {
      // Holiday Trip ends Jan 5, which is within Jan 4-10 week
      // Started before (Dec 26), ends within -> "last"
      const slots = sliceEventsByWeek([holidayTrip], januaryWeek)
      expect(slots.length).toBe(1)
      expect(slots[0].type).toBe('last')
    })

    it('should clamp event dates to week boundaries', () => {
      const slots = sliceEventsByWeek([holidayTrip], christmasWeek)
      // Original start: Dec 26, clamped to max(Dec 26, Dec 21) = Dec 26
      // Original end: Jan 5, clamped to min(Jan 5, Dec 27) = Dec 27
      expect(slots[0].start.getDate()).toBe(26)
      expect(slots[0].end.getDate()).toBe(27)
    })
  })

  describe('row assignment for overlapping events', () => {
    it('should assign different rows to 5 events on same day', () => {
      const slots = sliceEventsByWeek(christmasDayEvents, christmasWeek)

      expect(slots.length).toBe(5)

      // Each event should be on a different row (top position)
      const topPositions = slots.map(s => s.position.top)
      const uniqueTops = new Set(topPositions)
      expect(uniqueTops.size).toBe(5)

      // Rows should be 0, 1, 2, 3, 4 (times SLOT_HEIGHT + SLOT_GAP)
      topPositions.sort((a, b) => a - b)
      expect(topPositions).toEqual([0, 22, 44, 66, 88]) // 20px height + 2px gap
    })

    it('should assign zIndex based on row', () => {
      const slots = sliceEventsByWeek(christmasDayEvents, christmasWeek)

      // zIndex should be rowIndex + 1
      slots.forEach(slot => {
        const expectedRow = slot.position.top / 22 // (height + gap)
        expect(slot.zIndex).toBe(expectedRow + 1)
      })
    })
  })

  describe('non-overlapping events', () => {
    it('should allow different-day events to share same row', () => {
      // Two events on different days that don't overlap
      const events: Event[] = [
        { id: 'a', title: 'Monday', start: new Date(2025, 11, 22), end: new Date(2025, 11, 22), color: '#000', type: 'event' },
        { id: 'b', title: 'Friday', start: new Date(2025, 11, 26), end: new Date(2025, 11, 26), color: '#000', type: 'event' }
      ]

      const slots = sliceEventsByWeek(events, christmasWeek)

      // Both should be on row 0 (top: 0) since they don't overlap in day-granularity
      expect(slots[0].position.top).toBe(0)
      expect(slots[1].position.top).toBe(0)
    })
  })

  describe('draggable and resizable flags', () => {
    it('should set draggable true for editable events', () => {
      const slots = sliceEventsByWeek([christmasEve], christmasWeek)
      expect(slots[0].draggable).toBe(true)
      expect(slots[0].resizable).toBe(true)
    })

    it('should set draggable false for read-only events', () => {
      const readOnlyEvent: Event = {
        ...christmasEve,
        isReadOnly: true
      }
      const slots = sliceEventsByWeek([readOnlyEvent], christmasWeek)
      expect(slots[0].draggable).toBe(false)
      expect(slots[0].resizable).toBe(false)
    })

    it('should set draggable false for blocked events', () => {
      const blockedEvent: Event = {
        ...christmasEve,
        isBlocked: true
      }
      const slots = sliceEventsByWeek([blockedEvent], christmasWeek)
      expect(slots[0].draggable).toBe(false)
      expect(slots[0].resizable).toBe(false)
    })
  })
})
