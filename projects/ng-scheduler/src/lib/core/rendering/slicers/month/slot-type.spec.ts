import { determineSlotType } from './slot-type'
import { DateRange } from '../../../models/date-range.model'
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

describe('determineSlotType', () => {
  // Week containing Dec 21-27, 2025 (Sunday to Saturday)
  const weekRange: DateRange = {
    start: startOfWeek(new Date(2025, 11, 25)), // Dec 21
    end: endOfWeek(new Date(2025, 11, 25))      // Dec 27
  }

  describe('full type', () => {
    it('should return "full" for single-day event within week (Dec 24 - Christmas Eve)', () => {
      const eventRange: DateRange = {
        start: new Date(2025, 11, 24, 10, 0),
        end: new Date(2025, 11, 24, 12, 0)
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('full')
    })

    it('should return "full" for multi-day event within week (Dec 27-29)', () => {
      // Note: Dec 27 is Saturday in this week, but event ends on 29 which is next week
      // This actually tests "first" type - adjusting to stay within week
      const eventRange: DateRange = {
        start: new Date(2025, 11, 22, 9, 0),  // Mon Dec 22
        end: new Date(2025, 11, 26, 17, 0)   // Fri Dec 26
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('full')
    })

    it('should return "full" for event on Christmas Day (Dec 25)', () => {
      const eventRange: DateRange = {
        start: new Date(2025, 11, 25, 8, 0),
        end: new Date(2025, 11, 25, 17, 0)
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('full')
    })
  })

  describe('first type', () => {
    it('should return "first" for event starting in week and ending next week (Dec 26 - Jan 5)', () => {
      // This is the "Holiday Trip" event from playground
      const eventRange: DateRange = {
        start: new Date(2025, 11, 26), // Dec 26 (within week)
        end: new Date(2026, 0, 5)      // Jan 5 (way after week)
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('first')
    })

    it('should return "first" for event starting Saturday, ending Sunday next week', () => {
      const eventRange: DateRange = {
        start: new Date(2025, 11, 27, 9, 0),  // Sat Dec 27
        end: new Date(2025, 11, 28, 17, 0)    // Sun Dec 28
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('first')
    })
  })

  describe('last type', () => {
    it('should return "last" for event starting before week and ending within it', () => {
      const eventRange: DateRange = {
        start: new Date(2025, 11, 15),  // Dec 15 (before week)
        end: new Date(2025, 11, 23)     // Dec 23 (within week)
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('last')
    })
  })

  describe('middle type', () => {
    it('should return "middle" for event spanning entire week', () => {
      const eventRange: DateRange = {
        start: new Date(2025, 11, 10),  // Dec 10 (before week)
        end: new Date(2025, 11, 30)     // Dec 30 (after week)
      }
      expect(determineSlotType(eventRange, weekRange)).toBe('middle')
    })
  })

  describe('with second week of multi-week event (Dec 28 - Jan 3)', () => {
    const nextWeekRange: DateRange = {
      start: startOfWeek(new Date(2025, 11, 30)), // Dec 28
      end: endOfWeek(new Date(2025, 11, 30))      // Jan 3
    }

    it('should return "middle" for Holiday Trip in second week', () => {
      const holidayTrip: DateRange = {
        start: new Date(2025, 11, 26), // Dec 26
        end: new Date(2026, 0, 5)      // Jan 5
      }
      expect(determineSlotType(holidayTrip, nextWeekRange)).toBe('middle')
    })
  })

  describe('with third week of multi-week event (Jan 4-10)', () => {
    const thirdWeekRange: DateRange = {
      start: startOfWeek(new Date(2026, 0, 5)),  // Jan 4
      end: endOfWeek(new Date(2026, 0, 5))       // Jan 10
    }

    it('should return "last" for Holiday Trip in final week', () => {
      const holidayTrip: DateRange = {
        start: new Date(2025, 11, 26), // Dec 26
        end: new Date(2026, 0, 5)      // Jan 5 (ends mid-week)
      }
      expect(determineSlotType(holidayTrip, thirdWeekRange)).toBe('last')
    })
  })
})
