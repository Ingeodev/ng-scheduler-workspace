import { TestBed } from '@angular/core/testing';
import { EventStore } from './event.store';
import { Event, AllDayEvent, RecurrentEvent } from '../models/event';
import { Resource } from '../models/resource';

describe('EventStore', () => {
  let store: InstanceType<typeof EventStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(EventStore);
  });

  afterEach(() => {
    store.clear();
  });

  describe('Event Management', () => {
    it('should register a new event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      store.registerEvent(event);

      expect(store.eventCount()).toBe(1);
      expect(store.allEvents()).toContain(event);
    });

    it('should retrieve an event by ID', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      store.registerEvent(event);
      const retrieved = store.getEvent('evt-1');

      expect(retrieved).toEqual(event);
    });

    it('should update an existing event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Original Title',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      store.registerEvent(event);
      store.updateEvent('evt-1', { title: 'Updated Title' });

      const updated = store.getEvent('evt-1');
      expect(updated?.title).toBe('Updated Title');
    });

    it('should unregister an event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      store.registerEvent(event);
      expect(store.eventCount()).toBe(1);

      store.unregisterEvent('evt-1');
      expect(store.eventCount()).toBe(0);
    });

    it('should get events by resource ID', () => {
      const event1: Event = {
        id: 'evt-1',
        resourceId: 'resource-1',
        title: 'Event 1',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      const event2: Event = {
        id: 'evt-2',
        resourceId: 'resource-1',
        title: 'Event 2',
        start: new Date(2024, 0, 2, 10, 0),
        end: new Date(2024, 0, 2, 11, 0),
        type: 'event'
      };

      const event3: Event = {
        id: 'evt-3',
        resourceId: 'resource-2',
        title: 'Event 3',
        start: new Date(2024, 0, 3, 10, 0),
        end: new Date(2024, 0, 3, 11, 0),
        type: 'event'
      };

      store.registerEvent(event1);
      store.registerEvent(event2);
      store.registerEvent(event3);

      const resourceEvents = store.getEventsByResource('resource-1');
      expect(resourceEvents).toHaveLength(2);
      expect(resourceEvents).toContain(event1);
      expect(resourceEvents).toContain(event2);
    });
  });

  describe('AllDayEvent Management', () => {
    it('should register an all-day event', () => {
      const event: AllDayEvent = {
        id: 'all-day-1',
        title: 'Holiday',
        date: new Date(2024, 0, 1),
        type: 'all-day'
      };

      store.registerEvent(event);

      expect(store.eventCount()).toBe(1);
      expect(store.getEvent('all-day-1')).toEqual(event);
    });

    it('should handle multi-day all-day events', () => {
      const event: AllDayEvent = {
        id: 'all-day-1',
        title: 'Conference',
        date: new Date(2024, 0, 1),
        endDate: new Date(2024, 0, 3),
        type: 'all-day'
      };

      store.registerEvent(event);
      const retrieved = store.getEvent('all-day-1') as AllDayEvent;

      expect(retrieved.endDate).toEqual(new Date(2024, 0, 3));
    });
  });

  describe('RecurrentEvent Management', () => {
    it('should register a recurrent event', () => {
      const event: RecurrentEvent = {
        id: 'rec-1',
        title: 'Weekly Meeting',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        recurrenceRule: {
          type: 'weekly',
          interval: 1,
          byDay: ['Mon']
        },
        type: 'recurrent'
      };

      store.registerEvent(event);

      expect(store.eventCount()).toBe(1);
      expect(store.getEvent('rec-1')).toEqual(event);
    });
  });

  describe('Resource Management', () => {
    it('should register a new resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Conference Room A',
        color: '#0860c4'
      };

      store.registerResource(resource);

      expect(store.resourceCount()).toBe(1);
      expect(store.allResources()).toContain(resource);
    });

    it('should retrieve a resource by ID', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Conference Room A',
        color: '#0860c4'
      };

      store.registerResource(resource);
      const retrieved = store.getResource('res-1');

      expect(retrieved).toEqual(resource);
    });

    it('should update a resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4'
      };

      store.registerResource(resource);
      store.updateResource('res-1', { name: 'Conference Room A' });

      const updated = store.getResource('res-1');
      expect(updated?.name).toBe('Conference Room A');
    });

    it('should unregister a resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Conference Room A',
        color: '#0860c4'
      };

      store.registerResource(resource);
      expect(store.resourceCount()).toBe(1);

      store.unregisterResource('res-1');
      expect(store.resourceCount()).toBe(0);
    });
  });

  describe('Clear', () => {
    it('should clear all events and resources', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Test Event',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      const resource: Resource = {
        id: 'res-1',
        name: 'Conference Room A',
        color: '#0860c4'
      };

      store.registerEvent(event);
      store.registerResource(resource);

      expect(store.eventCount()).toBe(1);
      expect(store.resourceCount()).toBe(1);

      store.clear();

      expect(store.eventCount()).toBe(0);
      expect(store.resourceCount()).toBe(0);
    });
  });

  describe('Computed Values', () => {
    it('should compute allEvents correctly', () => {
      const event1: Event = {
        id: 'evt-1',
        title: 'Event 1',
        start: new Date(2024, 0, 1, 10, 0),
        end: new Date(2024, 0, 1, 11, 0),
        type: 'event'
      };

      const event2: Event = {
        id: 'evt-2',
        title: 'Event 2',
        start: new Date(2024, 0, 2, 10, 0),
        end: new Date(2024, 0, 2, 11, 0),
        type: 'event'
      };

      store.registerEvent(event1);
      store.registerEvent(event2);

      const allEvents = store.allEvents();
      expect(allEvents).toHaveLength(2);
    });

    it('should compute allResources correctly', () => {
      const resource1: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4'
      };

      const resource2: Resource = {
        id: 'res-2',
        name: 'Room B',
        color: '#e91e63'
      };

      store.registerResource(resource1);
      store.registerResource(resource2);

      const allResources = store.allResources();
      expect(allResources).toHaveLength(2);
    });
  });

  describe('Show/Hide Resource', () => {
    it('should show (activate) a resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4',
        isActive: false
      };

      store.registerResource(resource);
      expect(store.getResource('res-1')?.isActive).toBe(false);

      store.showResource('res-1');

      const updated = store.getResource('res-1');
      expect(updated?.isActive).toBe(true);
    });

    it('should hide (deactivate) a resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4',
        isActive: true
      };

      store.registerResource(resource);
      expect(store.getResource('res-1')?.isActive).toBe(true);

      store.hideResource('res-1');

      const updated = store.getResource('res-1');
      expect(updated?.isActive).toBe(false);
    });

    it('should handle showing an already active resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4',
        isActive: true
      };

      store.registerResource(resource);
      store.showResource('res-1');

      const updated = store.getResource('res-1');
      expect(updated?.isActive).toBe(true);
    });

    it('should handle hiding an already inactive resource', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4',
        isActive: false
      };

      store.registerResource(resource);
      store.hideResource('res-1');

      const updated = store.getResource('res-1');
      expect(updated?.isActive).toBe(false);
    });

    it('should not error when showing non-existent resource', () => {
      expect(() => store.showResource('non-existent')).not.toThrow();
      expect(store.getResource('non-existent')).toBeUndefined();
    });

    it('should not error when hiding non-existent resource', () => {
      expect(() => store.hideResource('non-existent')).not.toThrow();
      expect(store.getResource('non-existent')).toBeUndefined();
    });

    it('should toggle resource visibility correctly', () => {
      const resource: Resource = {
        id: 'res-1',
        name: 'Room A',
        color: '#0860c4',
        isActive: true
      };

      store.registerResource(resource);

      // Hide it
      store.hideResource('res-1');
      expect(store.getResource('res-1')?.isActive).toBe(false);

      // Show it again
      store.showResource('res-1');
      expect(store.getResource('res-1')?.isActive).toBe(true);
    });
  });
});
