import {
  isEvent,
  isAllDayEvent,
  isRecurrentEvent,
  Event,
  AllDayEvent,
  RecurrentEvent
} from './event';

describe('Event Type Guards', () => {
  describe('isEvent', () => {
    it('should return true for regular events', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      expect(isEvent(event)).toBe(true);
    });

    it('should return false for all-day events', () => {
      const event: AllDayEvent = {
        id: 'all-1',
        title: 'Holiday',
        date: new Date(2024, 0, 1),
        type: 'all-day'
      };

      expect(isEvent(event)).toBe(false);
    });

    it('should return false for recurrent events', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Weekly Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        recurrenceRule: {
          type: 'weekly',
          interval: 1
        },
        type: 'recurrent'
      };

      expect(isEvent(event)).toBe(false);
    });
  });

  describe('isAllDayEvent', () => {
    it('should return true for all-day events', () => {
      const event: AllDayEvent = {
        id: 'all-1',
        title: 'Holiday',
        date: new Date(2024, 0, 1),
        type: 'all-day'
      };

      expect(isAllDayEvent(event)).toBe(true);
    });

    it('should return false for regular events', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      expect(isAllDayEvent(event)).toBe(false);
    });
  });

  describe('isRecurrentEvent', () => {
    it('should return true for recurrent events', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Weekly Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        recurrenceRule: {
          type: 'weekly',
          interval: 1
        },
        type: 'recurrent'
      };

      expect(isRecurrentEvent(event)).toBe(true);
    });

    it('should return false for regular events', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      expect(isRecurrentEvent(event)).toBe(false);
    });
  });
});

describe('Event Interfaces', () => {
  describe('EventBase properties', () => {
    it('should have required properties', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      expect(event.id).toBeDefined();
      expect(event.title).toBeDefined();
      expect(event.type).toBe('event');
    });

    it('should support optional properties', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        resourceId: 'res-1',
        description: 'Test description',
        tags: ['important', 'meeting'],
        color: '#0860c4',
        isReadOnly: true,
        isBlocked: false,
        metadata: { customField: 'value' },
        type: 'event'
      };

      expect(event.resourceId).toBe('res-1');
      expect(event.description).toBe('Test description');
      expect(event.tags).toEqual(['important', 'meeting']);
      expect(event.color).toBe('#0860c4');
      expect(event.isReadOnly).toBe(true);
      expect(event.isBlocked).toBe(false);
      expect(event.metadata).toEqual({ customField: 'value' });
    });
  });

  describe('RecurrenceRule', () => {
    it('should support daily recurrence', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Daily Standup',
        start: new Date(2024, 0, 1, 9, 0),
        end: new Date(2024, 0, 1, 9, 15),
        recurrenceRule: {
          type: 'daily',
          interval: 1,
          count: 30
        },
        type: 'recurrent'
      };

      expect(event.recurrenceRule.type).toBe('daily');
      expect(event.recurrenceRule.count).toBe(30);
    });

    it('should support weekly recurrence with specific days', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Team Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        recurrenceRule: {
          type: 'weekly',
          interval: 1,
          byDay: ['Mon', 'Wed', 'Fri'],
          until: new Date(2024, 11, 31)
        },
        type: 'recurrent'
      };

      expect(event.recurrenceRule.type).toBe('weekly');
      expect(event.recurrenceRule.byDay).toEqual(['Mon', 'Wed', 'Fri']);
      expect(event.recurrenceRule.until).toEqual(new Date(2024, 11, 31));
    });

    it('should support monthly recurrence', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Monthly Review',
        start: new Date(2024, 0, 15, 14, 0),
        end: new Date(2024, 0, 15, 15, 0),
        recurrenceRule: {
          type: 'monthly',
          interval: 1,
          byMonthDay: [15]
        },
        type: 'recurrent'
      };

      expect(event.recurrenceRule.type).toBe('monthly');
      expect(event.recurrenceRule.byMonthDay).toEqual([15]);
    });

    it('should support recurrence exceptions', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Weekly Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        recurrenceRule: {
          type: 'weekly',
          interval: 1
        },
        recurrenceExceptions: [
          new Date(2024, 0, 15),
          new Date(2024, 0, 22)
        ],
        type: 'recurrent'
      };

      expect(event.recurrenceExceptions).toHaveLength(2);
    });
  });
});
