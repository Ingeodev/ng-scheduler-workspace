import { EventSlotAssigner, SlottedEvent } from './event-slot-assigner';
import { Event, AllDayEvent } from '../models/event';

describe('EventSlotAssigner', () => {
  let assigner: EventSlotAssigner;

  beforeEach(() => {
    assigner = new EventSlotAssigner();
  });

  describe('Single Day Events', () => {
    it('should assign slot 0 to single event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0), // Monday
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14); // Sunday
      const result = assigner.assignSlots([event], weekStart);

      expect(result).toHaveLength(1);
      expect(result[0].slotIndex).toBe(0);
      expect(result[0].dayStart).toBe(1); // Monday
      expect(result[0].dayEnd).toBe(1);
    });

    it('should assign different slots to overlapping same-day events', () => {
      const event1: Event = {
        id: 'evt-1',
        title: 'Meeting 1',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const event2: Event = {
        id: 'evt-2',
        title: 'Meeting 2',
        start: new Date(2024, 0, 15, 14, 0),
        end: new Date(2024, 0, 15, 15, 0),
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots([event1, event2], weekStart);

      expect(result).toHaveLength(2);
      expect(result[0].slotIndex).toBe(0);
      expect(result[1].slotIndex).toBe(1); // Different slot same day
    });
  });

  describe('Multi-day Events', () => {
    it('should handle multi-day event spanning 3 days', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Conference',
        start: new Date(2024, 0, 15, 0, 0), // Monday
        end: new Date(2024, 0, 17, 23, 59), // Wednesday
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14); // Sunday
      const result = assigner.assignSlots([event], weekStart);

      expect(result[0].dayStart).toBe(1); // Monday
      expect(result[0].dayEnd).toBe(3); // Wednesday
      expect(result[0].spanDays).toBe(3);
    });

    it('should assign slots to avoid collision with multi-day event', () => {
      const longEvent: Event = {
        id: 'evt-long',
        title: 'Conference',
        start: new Date(2024, 0, 15, 0, 0), // Mon-Wed
        end: new Date(2024, 0, 17, 23, 59),
        type: 'event'
      };

      const shortEvent: Event = {
        id: 'evt-short',
        title: 'Meeting',
        start: new Date(2024, 0, 16, 10, 0), // Tuesday (overlaps with conference)
        end: new Date(2024, 0, 16, 11, 0),
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots([longEvent, shortEvent], weekStart);

      // Long event should get slot 0 (sorted first)
      const longResult = result.find(r => r.event.id === 'evt-long');
      const shortResult = result.find(r => r.event.id === 'evt-short');

      expect(longResult!.slotIndex).toBe(0);
      expect(shortResult!.slotIndex).toBe(1); // Must go to next slot
    });
  });

  describe('Event Sorting', () => {
    it('should prioritize longer events (assign them first)', () => {
      const shortEvent: Event = {
        id: 'evt-short',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const longEvent: Event = {
        id: 'evt-long',
        title: 'Conference',
        start: new Date(2024, 0, 15, 0, 0),
        end: new Date(2024, 0, 17, 23, 59),
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots([shortEvent, longEvent], weekStart);

      // Even though short event was passed first, long event should get slot 0
      const longResult = result.find(r => r.event.id === 'evt-long');
      expect(longResult!.slotIndex).toBe(0);
    });
  });

  describe('Week Boundary Clamping', () => {
    it('should clamp event that starts before week', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Ongoing',
        start: new Date(2024, 0, 10, 0, 0), // Previous week
        end: new Date(2024, 0, 16, 0, 0),   // Tuesday of current week
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14); // Sunday
      const result = assigner.assignSlots([event], weekStart);

      expect(result[0].dayStart).toBe(0); // Clamped to Sunday
      expect(result[0].dayEnd).toBe(2);   // Tuesday
    });

    it('should clamp event that ends after week', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Ongoing',
        start: new Date(2024, 0, 18, 0, 0),  // Thursday
        end: new Date(2024, 0, 25, 0, 0),    // Next week
        type: 'event'
      };

      const weekStart = new Date(2024, 0, 14); // Sunday
      const result = assigner.assignSlots([event], weekStart);

      expect(result[0].dayStart).toBe(4); // Thursday
      expect(result[0].dayEnd).toBe(6);   // Clamped to Saturday
    });
  });

  describe('All-day Events', () => {
    it('should handle all-day events', () => {
      const event: AllDayEvent = {
        id: 'evt-1',
        title: 'Holiday',
        date: new Date(2024, 0, 15),
        type: 'all-day'
      };

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots([event], weekStart);

      expect(result[0].dayStart).toBe(1);
      expect(result[0].dayEnd).toBe(1);
    });

    it('should handle multi-day all-day events', () => {
      const event: AllDayEvent = {
        id: 'evt-1',
        title: 'Vacation',
        date: new Date(2024, 0, 15),
        endDate: new Date(2024, 0, 19),
        type: 'all-day'
      };

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots([event], weekStart);

      expect(result[0].dayStart).toBe(1); // Monday
      expect(result[0].dayEnd).toBe(5);   // Friday
      expect(result[0].spanDays).toBe(5);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle 5 events on the same day', () => {
      const events: Event[] = Array.from({ length: 5 }, (_, i) => ({
        id: `evt-${i}`,
        title: `Meeting ${i}`,
        start: new Date(2024, 0, 15, 10 + i, 0),
        end: new Date(2024, 0, 15, 11 + i, 0),
        type: 'event' as const
      }));

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots(events, weekStart);

      // Should have 5 different slots
      const slots = result.map(r => r.slotIndex);
      const uniqueSlots = new Set(slots);
      expect(uniqueSlots.size).toBe(5);
    });

    it('should handle mix of single and multi-day events', () => {
      const events: Array<Event | AllDayEvent> = [
        {
          id: 'evt-1',
          title: 'Long Conference',
          start: new Date(2024, 0, 15, 0, 0),
          end: new Date(2024, 0, 19, 23, 59),
          type: 'event'
        },
        {
          id: 'evt-2',
          title: 'Meeting Mon',
          start: new Date(2024, 0, 15, 10, 0),
          end: new Date(2024, 0, 15, 11, 0),
          type: 'event'
        },
        {
          id: 'evt-3',
          title: 'Meeting Wed',
          start: new Date(2024, 0, 17, 14, 0),
          end: new Date(2024, 0, 17, 15, 0),
          type: 'event'
        }
      ];

      const weekStart = new Date(2024, 0, 14);
      const result = assigner.assignSlots(events, weekStart);

      expect(result).toHaveLength(3);

      const conf = result.find(r => r.event.id === 'evt-1');
      const monMeeting = result.find(r => r.event.id === 'evt-2');
      const wedMeeting = result.find(r => r.event.id === 'evt-3');

      // Conference should get slot 0 (longest)
      expect(conf!.slotIndex).toBe(0);
      // Both meetings should be in slot 1 (conflict with conference)
      expect(monMeeting!.slotIndex).toBe(1);
      expect(wedMeeting!.slotIndex).toBe(1);
    });
  });
});
