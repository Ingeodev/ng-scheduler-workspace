import { expandRecurrentEvent } from './recurrent-events.helpers';
import { RecurrentEventModel, DayOfWeek } from '../../core/models/event.model';
import { DateRange } from '../../core/models/date-range.model';

describe('RecurrentEvents Helpers', () => {
  const baseEvent: Omit<RecurrentEventModel, 'recurrenceRule'> = {
    id: 'rec-1',
    title: 'Recurrent Event',
    start: new Date(2025, 0, 1, 10, 0), // Jan 1, 2025, 10:00
    end: new Date(2025, 0, 1, 11, 0),   // Jan 1, 2025, 11:00 (1 hour duration)
    type: 'recurrent'
  };

  const range: DateRange = {
    start: new Date(2025, 0, 1),
    end: new Date(2025, 1, 1) // End at start of Feb 1 (includes all of Jan)
  };

  it('should expand daily recurrence correctly', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'daily',
        interval: 1
      }
    };

    const instances = expandRecurrentEvent(event, range);

    expect(instances.length).toBe(31);
    expect(instances[0].start).toEqual(new Date(2025, 0, 1, 10, 0));
    expect(instances[30].start).toEqual(new Date(2025, 0, 31, 10, 0));

    // Verify duration (1 hour)
    expect(instances[0].end).toEqual(new Date(2025, 0, 1, 11, 0));

    // Verify type is forced to 'event'
    expect(instances[0].type).toBe('event');

    // Verify ID format
    expect(instances[0].id).toBe(`rec-1_${instances[0].start.getTime()}`);
  });

  it('should handle weekly recurrence on specific days', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'weekly',
        interval: 1,
        byDay: ['Mon', 'Wed'] as DayOfWeek[]
      }
    };

    const instances = expandRecurrentEvent(event, range);

    // Jan 2025: 
    // Mondays: 6, 13, 20, 27
    // Wednesdays: 1, 8, 15, 22, 29
    // Total: 9
    expect(instances.length).toBe(9);
    expect(instances[0].start.getDay()).toBe(3); // Wednesday (Jan 1)
    expect(instances[1].start.getDay()).toBe(1); // Monday (Jan 6)
  });

  it('should respect the "until" property', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'daily',
        interval: 1,
        until: new Date(2025, 0, 5, 23, 59) // Until end of Jan 5
      }
    };

    const instances = expandRecurrentEvent(event, range);

    expect(instances.length).toBe(5);
    expect(instances[4].start).toEqual(new Date(2025, 0, 5, 10, 0));
  });

  it('should respect the "count" property', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'daily',
        interval: 1,
        count: 3
      }
    };

    const instances = expandRecurrentEvent(event, range);

    expect(instances.length).toBe(3);
  });

  it('should handle recurrenceExceptions (exclusions)', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'daily',
        interval: 1
      },
      recurrenceExceptions: [
        new Date(2025, 0, 2, 10, 0), // Exclude Jan 2
        new Date(2025, 0, 5, 10, 0)  // Exclude Jan 5
      ]
    };

    const instances = expandRecurrentEvent(event, range);

    // 31 total - 2 exceptions = 29
    expect(instances.length).toBe(29);

    const dates = instances.map(i => i.start.getTime());
    expect(dates).not.toContain(new Date(2025, 0, 2, 10, 0).getTime());
    expect(dates).not.toContain(new Date(2025, 0, 5, 10, 0).getTime());
  });

  it('should only return instances within the provided range', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      recurrenceRule: {
        type: 'daily',
        interval: 1
      }
    };

    const customRange: DateRange = {
      start: new Date(2025, 0, 10),
      end: new Date(2025, 0, 15, 23, 59) // Include all of 15th
    };

    const instances = expandRecurrentEvent(event, customRange);

    expect(instances.length).toBe(6);
    expect(instances[0].start).toEqual(new Date(2025, 0, 10, 10, 0));
    expect(instances[5].start).toEqual(new Date(2025, 0, 15, 10, 0));
  });

  it('should preserve base properties and add recurrence tracking', () => {
    const event: RecurrentEventModel = {
      ...baseEvent,
      color: 'red',
      metadata: { foo: 'bar' },
      recurrenceRule: { type: 'daily', interval: 1 }
    };

    const instances = expandRecurrentEvent(event, range);
    const instance = instances[0];

    expect(instance.color).toBe('red');
    expect(instance.metadata.foo).toBe('bar');
    expect(instance.isRecurrenceInstance).toBe(true);
    expect(instance.parentRecurrenceId).toBe('rec-1');
    expect(instance.recurrenceDate).toEqual(instance.start);
  });
});
