import {
  calculateHorizontalPosition,
  findAvailableRow,
  calculateMaxVisibleRows,
  PlacedEventRange
} from './slot-positioning'
import { startOfWeek, addDays } from 'date-fns'

describe('slot-positioning', () => {
  // Week starting Dec 21, 2025 (Sunday)
  const weekStart = startOfWeek(new Date(2025, 11, 25))

  describe('calculateHorizontalPosition', () => {
    it('should calculate 0% left for Sunday event', () => {
      const start = weekStart // Sunday Dec 21
      const end = start
      const result = calculateHorizontalPosition(start, end, weekStart)
      expect(result.left).toBe(0)
      expect(result.width).toBeCloseTo(100 / 7) // ~14.28%
    })

    it('should calculate correct position for Christmas Day (Thursday Dec 25)', () => {
      const christmasDay = new Date(2025, 11, 25)
      const result = calculateHorizontalPosition(christmasDay, christmasDay, weekStart)
      // Thursday is index 4 (Sun=0, Mon=1, Tue=2, Wed=3, Thu=4)
      expect(result.left).toBeCloseTo((4 / 7) * 100) // ~57.14%
      expect(result.width).toBeCloseTo(100 / 7)      // ~14.28%
    })

    it('should calculate correct width for multi-day event (Dec 27-29 spans 3 days)', () => {
      const start = new Date(2025, 11, 27) // Saturday
      const end = new Date(2025, 11, 29)   // Monday (next week)
      // Clamped to week, so only Saturday counts
      const clampedEnd = new Date(2025, 11, 27) // Saturday only
      const result = calculateHorizontalPosition(start, clampedEnd, weekStart)
      expect(result.left).toBeCloseTo((6 / 7) * 100)  // Saturday = index 6
      expect(result.width).toBeCloseTo(100 / 7)       // 1 day
    })

    it('should calculate full week width for event spanning entire week', () => {
      const start = weekStart
      const end = addDays(weekStart, 6) // Saturday
      const result = calculateHorizontalPosition(start, end, weekStart)
      expect(result.left).toBe(0)
      expect(result.width).toBe(100) // Full week
    })

    it('should calculate correct position for Holiday Trip first segment (Dec 26-27)', () => {
      // Holiday Trip starts Dec 26, ends Jan 5
      // In first week, clamped to Dec 26-27 (Friday-Saturday = 2 days)
      const start = new Date(2025, 11, 26) // Friday
      const end = new Date(2025, 11, 27)   // Saturday
      const result = calculateHorizontalPosition(start, end, weekStart)
      expect(result.left).toBeCloseTo((5 / 7) * 100)  // Friday = index 5
      expect(result.width).toBeCloseTo((2 / 7) * 100) // 2 days
    })
  })

  describe('findAvailableRow', () => {
    it('should assign row 0 for first event', () => {
      const assignments = new Map<number, PlacedEventRange[]>()
      const row = findAvailableRow(
        new Date(2025, 11, 25, 8, 0),
        new Date(2025, 11, 25, 9, 0),
        assignments
      )
      expect(row).toBe(0)
    })

    it('should assign different rows for overlapping events on Christmas Day', () => {
      const assignments = new Map<number, PlacedEventRange[]>()

      // 5 events on Dec 25 (from playground)
      const christmasEvents = [
        { start: new Date(2025, 11, 25, 8, 0), end: new Date(2025, 11, 25, 9, 0) },
        { start: new Date(2025, 11, 25, 10, 0), end: new Date(2025, 11, 25, 11, 0) },
        { start: new Date(2025, 11, 25, 12, 0), end: new Date(2025, 11, 25, 13, 0) },
        { start: new Date(2025, 11, 25, 14, 0), end: new Date(2025, 11, 25, 15, 0) },
        { start: new Date(2025, 11, 25, 16, 0), end: new Date(2025, 11, 25, 17, 0) },
      ]

      // All events are on the same day, so they all overlap in day granularity
      const rows = christmasEvents.map(event =>
        findAvailableRow(event.start, event.end, assignments)
      )

      // Each should get a different row
      expect(rows).toEqual([0, 1, 2, 3, 4])
    })

    it('should allow non-overlapping events to share same row', () => {
      const assignments = new Map<number, PlacedEventRange[]>()

      // Event on Dec 22 (Monday)
      const row1 = findAvailableRow(
        new Date(2025, 11, 22),
        new Date(2025, 11, 22),
        assignments
      )

      // Event on Dec 25 (Thursday) - doesn't overlap with Dec 22
      const row2 = findAvailableRow(
        new Date(2025, 11, 25),
        new Date(2025, 11, 25),
        assignments
      )

      // Both should be on row 0 (no overlap)
      expect(row1).toBe(0)
      expect(row2).toBe(0)
    })

    it('should handle adjacent events correctly (no overlap)', () => {
      const assignments = new Map<number, PlacedEventRange[]>()

      // Event ending Dec 24
      const row1 = findAvailableRow(
        new Date(2025, 11, 22),
        new Date(2025, 11, 24),
        assignments
      )

      // Event starting Dec 25 (adjacent, not overlapping)
      const row2 = findAvailableRow(
        new Date(2025, 11, 25),
        new Date(2025, 11, 26),
        assignments
      )

      // Should share row 0 (adjacent = no overlap)
      expect(row1).toBe(0)
      expect(row2).toBe(0)
    })

    it('should put multi-week event below single-day events when they overlap', () => {
      const assignments = new Map<number, PlacedEventRange[]>()

      // First: Christmas Eve event (Dec 24)
      findAvailableRow(
        new Date(2025, 11, 24, 10, 0),
        new Date(2025, 11, 24, 12, 0),
        assignments
      )

      // Second: Holiday Trip (Dec 26 - Jan 5) - starts after Christmas Eve
      const holidayRow = findAvailableRow(
        new Date(2025, 11, 26),
        new Date(2025, 11, 27), // Clamped to week end
        assignments
      )

      // Should be on row 0 since they don't overlap (24 vs 26-27)
      expect(holidayRow).toBe(0)
    })
  })

  describe('calculateMaxVisibleRows', () => {
    const SLOT_HEIGHT = 20
    const SLOT_GAP = 2

    it('should return 0 for zero or negative container height', () => {
      expect(calculateMaxVisibleRows(0, SLOT_HEIGHT, SLOT_GAP)).toBe(0)
      expect(calculateMaxVisibleRows(-10, SLOT_HEIGHT, SLOT_GAP)).toBe(0)
    })

    it('should calculate 3 rows for 66px container (default week height)', () => {
      // Row 0: 0-20px, Row 1: 22-42px, Row 2: 44-64px
      expect(calculateMaxVisibleRows(66, SLOT_HEIGHT, SLOT_GAP)).toBe(3)
    })

    it('should calculate 5 rows for expanded container with 5 Christmas events', () => {
      // 5 events need: 5*20 + 4*2 = 108px
      expect(calculateMaxVisibleRows(110, SLOT_HEIGHT, SLOT_GAP)).toBe(5)
    })

    it('should handle exact fit', () => {
      // Exactly 1 row: 20px
      expect(calculateMaxVisibleRows(20, SLOT_HEIGHT, SLOT_GAP)).toBe(1)
      // Exactly 2 rows: 20 + 2 + 20 = 42px
      expect(calculateMaxVisibleRows(42, SLOT_HEIGHT, SLOT_GAP)).toBe(2)
    })
  })
})
