import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventRenderComponent, LayoutSegment } from './event-render';
import { Event } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';
import { MONTH_VIEW_LAYOUT, MONTH_VIEW_COMPUTED } from '../../../core/config/month-view.config';

/**
 * Positioning validation tests - verify layout consistency without brittle pixel assertions
 * These tests ensure the Google Calendar positioning approach remains intact
 */
describe('EventRenderComponent - Positioning Validation', () => {
  let component: EventRenderComponent;
  let fixture: ComponentFixture<EventRenderComponent>;

  const CELL_WIDTH = 100;
  const CELL_HEIGHT = 120;

  const mockEvent: Event = {
    id: 'evt-1',
    title: 'Test Event',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
    type: 'event'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRenderComponent],
      providers: [EventStore]
    }).compileComponents();

    fixture = TestBed.createComponent(EventRenderComponent);
    component = fixture.componentInstance;
  });

  describe('Unit Consistency (Google Calendar Approach)', () => {
    it('should use percentage for width', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const widthStr = slots[0].style['--event-width'];

      expect(widthStr).toContain('%');
    });

    it('should use em for height', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const heightStr = slots[0].style['--event-height'];

      expect(heightStr).toContain('em');

      const heightValue = parseFloat(heightStr);
      expect(heightValue).toBe(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_EM);
    });

    it('should use pixels for Y position', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const yStr = slots[0].style['--event-y'];

      expect(yStr).toContain('px');
    });

    it('should use percentage for X position', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const xStr = slots[0].style['--event-x'];

      expect(xStr).toContain('%');
    });
  });

  describe('Slot Spacing Consistency', () => {
    it('should maintain uniform spacing between consecutive slots', () => {
      const segments: LayoutSegment[] = [0, 1, 2].map(index => ({
        slotIndex: index,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      }));

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', segments);
      fixture.detectChanges();

      const slots = component.derivedSlots();

      const y0 = parseFloat(slots[0].style['--event-y']);
      const y1 = parseFloat(slots[1].style['--event-y']);
      const y2 = parseFloat(slots[2].style['--event-y']);

      const spacing01 = y1 - y0;
      const spacing12 = y2 - y1;

      // Spacing should be consistent
      expect(spacing01).toBe(spacing12);

      // Spacing should be positive
      expect(spacing01).toBeGreaterThan(0);

      // Spacing should be reasonable (not too small, not too large)
      expect(spacing01).toBeGreaterThan(10);
      expect(spacing01).toBeLessThan(100);
    });

    it('should place slot 1 below slot 0', () => {
      const segments: LayoutSegment[] = [
        {
          slotIndex: 0,
          viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
          cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
          dateContext: new Date(2024, 0, 15)
        },
        {
          slotIndex: 1,
          viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
          cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
          dateContext: new Date(2024, 0, 15)
        }
      ];

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', segments);
      fixture.detectChanges();

      const slots = component.derivedSlots();

      const y0 = parseFloat(slots[0].style['--event-y']);
      const y1 = parseFloat(slots[1].style['--event-y']);

      expect(y1).toBeGreaterThan(y0);
    });

    it('should increase Y position proportionally with slot index', () => {
      const segments: LayoutSegment[] = [0, 1, 2, 3].map(index => ({
        slotIndex: index,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      }));

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', segments);
      fixture.detectChanges();

      const slots = component.derivedSlots();

      for (let i = 1; i < slots.length; i++) {
        const yPrev = parseFloat(slots[i - 1].style['--event-y']);
        const yCurrent = parseFloat(slots[i].style['--event-y']);

        expect(yCurrent).toBeGreaterThan(yPrev);
      }
    });
  });

  describe('Multi-Day Event Width', () => {
    it('should increase width for multi-day events', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      // Single day event
      const singleDay: Event = {
        ...mockEvent,
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0)
      };

      fixture.componentRef.setInput('event', singleDay);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const singleDayWidth = parseFloat(component.derivedSlots()[0].style['--event-width']);

      // Multi-day event
      const multiDay: Event = {
        ...mockEvent,
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 17, 11, 0) // 3 days
      };

      fixture.componentRef.setInput('event', multiDay);
      fixture.detectChanges();

      const multiDayWidth = parseFloat(component.derivedSlots()[0].style['--event-width']);

      expect(multiDayWidth).toBeGreaterThan(singleDayWidth);
    });

    it('should use day width percentage as base unit', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const widthPercent = parseFloat(slots[0].style['--event-width']);

      // Width should be a reasonable percentage
      expect(widthPercent).toBeGreaterThan(0);
      expect(widthPercent).toBeLessThanOrEqual(100);

      // For single day, should be approximately one day width
      expect(widthPercent).toBeGreaterThan(10);
      expect(widthPercent).toBeLessThan(20);
    });
  });

  describe('Height Consistency', () => {
    it('should use same height for all slots of same event', () => {
      const segments: LayoutSegment[] = [0, 1, 2].map(index => ({
        slotIndex: index,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      }));

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', segments);
      fixture.detectChanges();

      const slots = component.derivedSlots();

      const heights = slots.map(slot => slot.style['--event-height']);

      // All heights should be identical
      expect(new Set(heights).size).toBe(1);
    });

    it('should use configured event height', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const heightEm = parseFloat(slots[0].style['--event-height']);

      expect(heightEm).toBe(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_EM);
    });
  });

  describe('Z-Index Layering', () => {
    it('should have defined z-index', () => {
      const segment: LayoutSegment = {
        slotIndex: 0,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const slots = component.derivedSlots();
      const zIndex = slots[0].style['--event-z'];

      expect(zIndex).toBeDefined();
      expect(typeof zIndex).toBe('number');
      expect(zIndex).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Positioning Stability', () => {
    it('should produce same position for same inputs', () => {
      const segment: LayoutSegment = {
        slotIndex: 2,
        viewBoundaries: { start: new Date(2024, 0, 14), end: new Date(2024, 0, 20) },
        cellDimensions: { width: CELL_WIDTH, height: CELL_HEIGHT },
        dateContext: new Date(2024, 0, 15)
      };

      fixture.componentRef.setInput('event', mockEvent);
      fixture.componentRef.setInput('layoutSegments', [segment]);
      fixture.detectChanges();

      const firstRender = component.derivedSlots()[0];

      // Re-render with same inputs
      fixture.detectChanges();

      const secondRender = component.derivedSlots()[0];

      expect(firstRender.style['--event-x']).toBe(secondRender.style['--event-x']);
      expect(firstRender.style['--event-y']).toBe(secondRender.style['--event-y']);
      expect(firstRender.style['--event-width']).toBe(secondRender.style['--event-width']);
      expect(firstRender.style['--event-height']).toBe(secondRender.style['--event-height']);
    });
  });
});
