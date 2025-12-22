import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthView } from './month-view';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';
import { GridSyncService } from '../../../core/services/grid-sync.service';
import { Event } from '../../../core/models/event';
import { Resource } from '../../../core/models/resource';
import { signal } from '@angular/core';

describe('MonthView', () => {
  let component: MonthView;
  let fixture: ComponentFixture<MonthView>;
  let eventStore: InstanceType<typeof EventStore>;
  let calendarStore: CalendarStore;

  beforeEach(async () => {
    // Mock GridSyncService with proper dimensions
    const mockGridSync = {
      gridBounds: signal({ cellWidth: 100, cellHeight: 100 }),
      observeGrid: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MonthView],
      providers: [
        CalendarStore,
        { provide: GridSyncService, useValue: mockGridSync }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthView);
    component = fixture.componentInstance;
    eventStore = TestBed.inject(EventStore);
    calendarStore = TestBed.inject(CalendarStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    eventStore.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Event Filtering by Active Resources', () => {
    it('should show events from active resources', () => {
      const resource: Resource = {
        id: 'resource-1',
        name: 'Room A',
        color: '#4285f4',
        isActive: true
      };

      const event: Event = {
        id: 'evt-1',
        resourceId: 'resource-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      eventStore.registerResource(resource);
      eventStore.registerEvent(event);

      // Sync resources to calendar store
      calendarStore.setResources([resource]);
      calendarStore.setDate(new Date(2024, 0, 15));

      fixture.detectChanges();

      const renderedEvents = component.eventsToRender();
      expect(renderedEvents.length).toBe(1);
      expect(renderedEvents[0].event.id).toBe('evt-1');
    });

    it('should hide events from inactive resources', () => {
      const resource: Resource = {
        id: 'resource-1',
        name: 'Room A',
        color: '#4285f4',
        isActive: false // Inactive
      };

      const event: Event = {
        id: 'evt-1',
        resourceId: 'resource-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      eventStore.registerResource(resource);
      eventStore.registerEvent(event);

      // Sync resources to calendar store
      calendarStore.setResources([resource]);
      calendarStore.setDate(new Date(2024, 0, 15));

      fixture.detectChanges();

      const renderedEvents = component.eventsToRender();
      expect(renderedEvents.length).toBe(0); // Event should be filtered out
    });

    it('should show events without resourceId regardless of active resources', () => {
      const event: Event = {
        id: 'evt-1',
        // No resourceId
        title: 'General Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      eventStore.registerEvent(event);
      calendarStore.setDate(new Date(2024, 0, 15));

      fixture.detectChanges();

      const renderedEvents = component.eventsToRender();
      expect(renderedEvents.length).toBe(1);
    });

    it('should filter mixed active/inactive resources correctly', () => {
      const activeResource: Resource = {
        id: 'resource-1',
        name: 'Room A',
        color: '#4285f4',
        isActive: true
      };

      const inactiveResource: Resource = {
        id: 'resource-2',
        name: 'Room B',
        color: '#ea4335',
        isActive: false
      };

      const event1: Event = {
        id: 'evt-1',
        resourceId: 'resource-1',
        title: 'Meeting 1',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const event2: Event = {
        id: 'evt-2',
        resourceId: 'resource-2',
        title: 'Meeting 2',
        start: new Date(2024, 0, 15, 14, 0),
        end: new Date(2024, 0, 15, 15, 0),
        type: 'event'
      };

      eventStore.registerResource(activeResource);
      eventStore.registerResource(inactiveResource);
      eventStore.registerEvent(event1);
      eventStore.registerEvent(event2);

      calendarStore.setResources([activeResource, inactiveResource]);
      calendarStore.setDate(new Date(2024, 0, 15));

      fixture.detectChanges();

      const renderedEvents = component.eventsToRender();
      expect(renderedEvents.length).toBe(1);
      expect(renderedEvents[0].event.id).toBe('evt-1');
    });
  });
});
