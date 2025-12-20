import { EventLayoutEngine, CollisionGroup } from './event-layout.engine';
import { Event } from '../models/event';

describe('EventLayoutEngine', () => {
  let engine: EventLayoutEngine;

  beforeEach(() => {
    engine = new EventLayoutEngine();
  });

  describe('calculateLayout', () => {
    it('should handle single event without collisions', () => {
      const events: Event[] = [{
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      }];

      const result = engine.calculateLayout(events, new Date(2024, 0, 15));

      expect(result).toHaveLength(1);
      expect(result[0].events).toHaveLength(1);
      expect(result[0].columns).toBe(1);
      expect(result[0].assignments.get('evt-1')).toBe(0);
    });

    it('should detect collision between two overlapping events', () => {
      const events: Event[] = [
        {
          id: 'evt-1',
          title: 'Meeting 1',
          start: new Date(2024, 0, 15, 10, 0),
          end: new Date(2024, 0, 15, 11, 0),
          type: 'event'
        },
        {
          id: 'evt-2',
          title: 'Meeting 2',
          start: new Date(2024, 0, 15, 10, 30),
          end: new Date(2024, 0, 15, 11, 30),
          type: 'event'
        }
      ];

      const result = engine.calculateLayout(events, new Date(2024, 0, 15));

      expect(result).toHaveLength(1); // One collision group
      expect(result[0].events).toHaveLength(2);
      expect(result[0].columns).toBe(2); // Two columns needed
      expect(result[0].assignments.get('evt-1')).toBe(0);
      expect(result[0].assignments.get('evt-2')).toBe(1);
    });

    it('should handle three overlapping events', () => {
      const events: Event[] = [
        {
          id: 'evt-1',
          title: 'Event 1',
          start: new Date(2024, 0, 15, 10, 0),
          end: new Date(2024, 0, 15, 12, 0),
          type: 'event'
        },
        {
          id: 'evt-2',
          title: 'Event 2',
          start: new Date(2024, 0, 15, 10, 30),
          end: new Date(2024, 0, 15, 11, 30),
          type: 'event'
        },
        {
          id: 'evt-3',
          title: 'Event 3',
          start: new Date(2024, 0, 15, 11, 0),
          end: new Date(2024, 0, 15, 13, 0),
          type: 'event'
        }
      ];

      const result = engine.calculateLayout(events, new Date(2024, 0, 15));

      expect(result).toHaveLength(1);
      expect(result[0].columns).toBe(3); // Three events need 3 columns
    });

    it('should create separate groups for non-overlapping events', () => {
      const events: Event[] = [
        {
          id: 'evt-1',
          title: 'Morning',
          start: new Date(2024, 0, 15, 9, 0),
          end: new Date(2024, 0, 15, 10, 0),
          type: 'event'
        },
        {
          id: 'evt-2',
          title: 'Afternoon',
          start: new Date(2024, 0, 15, 14, 0),
          end: new Date(2024, 0, 15, 15, 0),
          type: 'event'
        }
      ];

      const result = engine.calculateLayout(events, new Date(2024, 0, 15));

      expect(result).toHaveLength(2); // Two separate groups
      expect(result[0].columns).toBe(1);
      expect(result[1].columns).toBe(1);
    });
  });

  describe('calculateEventBounds', () => {
    it('should calculate full width for single column', () => {
      const bounds = engine.calculateEventBounds({} as any, 0, 1, 100);

      expect(bounds.width).toBe(100);
      expect(bounds.left).toBe(0);
    });

    it('should split width evenly for two columns', () => {
      const bounds1 = engine.calculateEventBounds({} as any, 0, 2, 100);
      const bounds2 = engine.calculateEventBounds({} as any, 1, 2, 100);

      expect(bounds1.width).toBe(50);
      expect(bounds1.left).toBe(0);
      expect(bounds2.width).toBe(50);
      expect(bounds2.left).toBe(50);
    });

    it('should handle three columns', () => {
      const bounds = engine.calculateEventBounds({} as any, 2, 3, 150);

      expect(bounds.width).toBe(50);
      expect(bounds.left).toBe(100);
    });
  });
});
