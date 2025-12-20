import { EventRenderData, EventRenderer } from './event-renderer';
import { EventRendererFactory } from './event-renderer.factory';
import { MonthViewRenderer } from './month-view.renderer';
import { WeekViewRenderer } from './week-view.renderer';
import { DayViewRenderer } from './day-view.renderer';
import { Event, AllDayEvent, RecurrentEvent } from '../models/event';
import { ViewMode } from '../models/config-schedule';

describe('EventRenderer - Abstract Class', () => {
  it('should define abstract render method', () => {
    // EventRenderer is abstract and defines the interface
    // Concrete implementations are tested separately
    expect(EventRenderer).toBeDefined();
  });
});

describe('MonthViewRenderer', () => {
  let renderer: MonthViewRenderer;

  beforeEach(() => {
    renderer = new MonthViewRenderer();
  });

  describe('render()', () => {
    it('should render a single-day event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 1);
      const result = renderer.render(event, viewDate);

      expect(result).toBeDefined();
      expect(result.position).toBeDefined();
      expect(result.position.top).toBeGreaterThanOrEqual(0);
      expect(result.position.left).toBeGreaterThanOrEqual(0);
      expect(result.position.width).toBeGreaterThan(0);
      expect(result.position.height).toBeGreaterThan(0);
      expect(result.zIndex).toBe(1);
    });

    it('should calculate correct day position for event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0), // Day 15
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 1);
      const result = renderer.render(event, viewDate);

      // Day 15 position should be calculated based on week/day layout
      expect(result.layout).toBeDefined();
      expect(result.layout.column).toBeGreaterThanOrEqual(0);
      expect(result.layout.column).toBeLessThan(7);
    });

    it('should handle multi-day events', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Conference',
        start: new Date(2024, 0, 15, 9, 0),
        end: new Date(2024, 0, 17, 17, 0), // 3 days
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 1);
      const result = renderer.render(event, viewDate);

      expect(result.slices).toBeDefined();
      expect(result.slices!.length).toBeGreaterThan(1);
    });
  });

  describe('calculateSlices()', () => {
    it('should create slices for multi-day event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Conference',
        start: new Date(2024, 0, 15, 9, 0),
        end: new Date(2024, 0, 17, 17, 0),
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 1);
      const slices = renderer.calculateSlices(event, viewDate);

      expect(slices.length).toBe(3); // 15, 16, 17
      expect(slices[0].isStart).toBe(true);
      expect(slices[0].isEnd).toBe(false);
      expect(slices[2].isStart).toBe(false);
      expect(slices[2].isEnd).toBe(true);
    });

    it('should not create slices for single-day event', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 1);
      const slices = renderer.calculateSlices(event, viewDate);

      expect(slices.length).toBe(0);
    });
  });

  describe('getSnapPoints()', () => {
    it('should return daily snap points for month view', () => {
      const date = new Date(2024, 0, 15);
      const snapPoints = renderer.getSnapPoints(date);

      expect(snapPoints).toBeDefined();
      expect(snapPoints.length).toBeGreaterThan(0);
      expect(snapPoints[0]).toBeInstanceOf(Date);
    });
  });
});

describe('WeekViewRenderer', () => {
  let renderer: WeekViewRenderer;

  beforeEach(() => {
    renderer = new WeekViewRenderer();
  });

  describe('render()', () => {
    it('should render event with time-based height', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Meeting',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 12, 0), // 2 hours
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 15);
      const result = renderer.render(event, viewDate);

      expect(result.position.height).toBeGreaterThan(0);
      // Height should be proportional to duration (2 hours)
    });

    it('should position event based on start time', () => {
      const event: Event = {
        id: 'evt-1',
        title: 'Morning Meeting',
        start: new Date(2024, 0, 15, 9, 0), // 9 AM
        end: new Date(2024, 0, 15, 10, 0),
        type: 'event'
      };

      const viewDate = new Date(2024, 0, 15);
      const result = renderer.render(event, viewDate);

      // Top position should reflect 9 AM
      expect(result.position.top).toBeGreaterThan(0);
    });
  });

  describe('getSnapPoints()', () => {
    it('should return 15-minute interval snap points', () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const snapPoints = renderer.getSnapPoints(date);

      expect(snapPoints.length).toBeGreaterThan(0);

      // Check intervals are 15 minutes apart
      for (let i = 1; i < snapPoints.length; i++) {
        const diff = snapPoints[i].getTime() - snapPoints[i - 1].getTime();
        expect(diff).toBe(15 * 60 * 1000); // 15 minutes in ms
      }
    });
  });
});

describe('DayViewRenderer', () => {
  let renderer: DayViewRenderer;

  beforeEach(() => {
    renderer = new DayViewRenderer();
  });

  it('should render similar to week view but with more detail', () => {
    const event: Event = {
      id: 'evt-1',
      title: 'Meeting',
      start: new Date(2024, 0, 15, 10, 30),
      end: new Date(2024, 0, 15, 11, 15),
      type: 'event'
    };

    const viewDate = new Date(2024, 0, 15);
    const result = renderer.render(event, viewDate);

    expect(result).toBeDefined();
    expect(result.position).toBeDefined();
  });
});

describe('EventRendererFactory', () => {
  describe('getRenderer()', () => {
    it('should return MonthViewRenderer for month view', () => {
      const renderer = EventRendererFactory.getRenderer('month');
      expect(renderer).toBeInstanceOf(MonthViewRenderer);
    });

    it('should return WeekViewRenderer for week view', () => {
      const renderer = EventRendererFactory.getRenderer('week');
      expect(renderer).toBeInstanceOf(WeekViewRenderer);
    });

    it('should return DayViewRenderer for day view', () => {
      const renderer = EventRendererFactory.getRenderer('day');
      expect(renderer).toBeInstanceOf(DayViewRenderer);
    });

    it('should return DayViewRenderer for resource view', () => {
      const renderer = EventRendererFactory.getRenderer('resource');
      expect(renderer).toBeInstanceOf(DayViewRenderer);
    });

    it('should throw error for invalid view mode', () => {
      expect(() => {
        EventRendererFactory.getRenderer('invalid' as ViewMode);
      }).toThrow();
    });

    it('should cache renderer instances', () => {
      const renderer1 = EventRendererFactory.getRenderer('month');
      const renderer2 = EventRendererFactory.getRenderer('month');

      expect(renderer1).toBe(renderer2);
    });
  });
});
