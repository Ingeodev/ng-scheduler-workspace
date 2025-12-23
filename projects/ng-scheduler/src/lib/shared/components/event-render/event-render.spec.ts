import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventRenderComponent, LayoutSegment } from './event-render';
import { Event } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';
import { signal } from '@angular/core';

describe('EventRenderComponent', () => {
  let component: EventRenderComponent;
  let fixture: ComponentFixture<EventRenderComponent>;
  let eventStore: EventStore;

  const mockEvent: Event = {
    id: 'evt-1',
    title: 'Test Event',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
    color: '#e91e63',
    type: 'event'
  };

  const mockLayoutSegment: LayoutSegment = {
    slotIndex: 0,
    viewBoundaries: {
      start: new Date(2024, 0, 14),
      end: new Date(2024, 0, 20)
    },
    cellDimensions: {
      width: 100,
      height: 100
    },
    dateContext: new Date(2024, 0, 15)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRenderComponent],
      providers: [EventStore]
    }).compileComponents();

    fixture = TestBed.createComponent(EventRenderComponent);
    component = fixture.componentInstance;
    eventStore = TestBed.inject(EventStore);

    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('layoutSegments', [mockLayoutSegment]);
    fixture.componentRef.setInput('viewMode', 'month');

    fixture.detectChanges();
  });

  afterEach(() => {
    eventStore.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Color Resolution', () => {
    it('should use event color when present', () => {
      const slots = component.derivedSlots();
      expect(slots[0].style['--event-color']).toBe('#e91e63');
    });

    it('should use resource color when event color absent', (done) => {
      const eventWithoutColor: Event = {
        ...mockEvent,
        color: undefined,
        resourceId: 'resource-1'
      };

      eventStore.registerResource({
        id: 'resource-1',
        name: 'Test Resource',
        color: '#00ff00'
      });

      fixture.componentRef.setInput('event', eventWithoutColor);
      fixture.detectChanges();

      setTimeout(() => {
        const slots = component.derivedSlots();
        expect(slots[0].style['--event-color']).toBe('#00ff00');
        done();
      }, 100);
    });

    it('should use default color when both absent', (done) => {
      const eventWithoutColor: Event = {
        ...mockEvent,
        color: undefined,
        resourceId: undefined
      };

      fixture.componentRef.setInput('event', eventWithoutColor);
      fixture.detectChanges();

      setTimeout(() => {
        const slots = component.derivedSlots();
        expect(slots[0].style['--event-color']).toBe('#0860c4');
        done();
      }, 100);
    });

    it('should override with explicit eventColor input', () => {
      fixture.componentRef.setInput('eventColor', '#ff0000');
      fixture.detectChanges();

      const slots = component.derivedSlots();
      expect(slots[0].style['--event-color']).toBe('#ff0000');
    });
  });

  describe('Color Scheme Generation', () => {
    it('should generate complete color scheme', () => {
      const slots = component.derivedSlots();
      const style = slots[0].style;

      expect(style['--event-color']).toBeDefined();
      expect(style['--event-hover-color']).toBeDefined();
      expect(style['--event-bg-color']).toBeDefined();
      expect(style['--event-text-color']).toBeDefined();
    });

    it('should generate darker hover color', () => {
      const slots = component.derivedSlots();
      const baseColor = slots[0].style['--event-color'];
      const hoverColor = slots[0].style['--event-hover-color'];

      expect(baseColor).toBe('#e91e63');
      expect(hoverColor).not.toBe(baseColor);
    });
  });

  describe('Multi-Segment Rendering', () => {
    it('should render multiple segments', () => {
      const segment2: LayoutSegment = {
        ...mockLayoutSegment,
        slotIndex: 1
      };

      fixture.componentRef.setInput('layoutSegments', [mockLayoutSegment, segment2]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      expect(slots.length).toBe(2);
    });

    it('should compute different positions for each segment', () => {
      const segment2: LayoutSegment = {
        ...mockLayoutSegment,
        slotIndex: 1  // Different slot
      };

      fixture.componentRef.setInput('layoutSegments', [mockLayoutSegment, segment2]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      expect(slots[0].style['--event-y']).not.toBe(slots[1].style['--event-y']);
    });
  });

  describe('Hover State Management', () => {
    it('should set hovered state on slot hover', () => {
      expect(component.isHovered()).toBe(false);

      component.onSlotHover(true);
      expect(component.isHovered()).toBe(true);

      component.onSlotHover(false);
      expect(component.isHovered()).toBe(false);
    });

    it('should emit eventHovered on hover enter', () => {
      let hoveredEvent: Event | undefined;
      component.eventHovered.subscribe(event => hoveredEvent = event);

      component.onSlotHover(true);

      expect(hoveredEvent).toEqual(mockEvent);
    });
  });

  describe('Click Handling', () => {
    it('should emit event on slot click', () => {
      let clickedEvent: Event | undefined;
      component.eventClicked.subscribe(event => clickedEvent = event);

      component.onSlotClick();

      expect(clickedEvent).toEqual(mockEvent);
    });
  });

  describe('Selection API', () => {
    it('should support manual selection', () => {
      component.select();
      expect(component.isSelected()).toBe(true);

      component.deselect();
      expect(component.isSelected()).toBe(false);
    });
  });

  describe('View Mode Switching', () => {
    it('should use different renderer for month view', () => {
      fixture.componentRef.setInput('viewMode', 'month');
      fixture.detectChanges();

      const monthSlots = component.derivedSlots();
      expect(monthSlots.length).toBeGreaterThan(0);
    });

    it('should use different renderer for week view', () => {
      fixture.componentRef.setInput('viewMode', 'week');
      fixture.detectChanges();

      const weekSlots = component.derivedSlots();
      expect(weekSlots.length).toBeGreaterThan(0);
    });
  });
});
