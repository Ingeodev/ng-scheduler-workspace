import {
  EventRendererFactory,
  MonthViewRenderer,
  WeekViewRenderer,
  DayViewRenderer,
  ResourceViewRenderer
} from './event-renderer';
import { Event } from '../models/event';

describe('EventRenderer', () => {
  const mockEvent: Event = {
    id: 'evt-1',
    title: 'Test Event',
    start: new Date(2024, 0, 1, 10, 0),
    end: new Date(2024, 0, 1, 11, 0),
    color: '#0860c4',
    type: 'event'
  };

  describe('EventRendererFactory', () => {
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

    it('should return ResourceViewRenderer for resource view', () => {
      const renderer = EventRendererFactory.getRenderer('resource');
      expect(renderer).toBeInstanceOf(ResourceViewRenderer);
    });

    it('should throw error for invalid view mode', () => {
      expect(() => {
        EventRendererFactory.getRenderer('invalid' as any);
      }).toThrow();
    });
  });

  describe('MonthViewRenderer', () => {
    let renderer: MonthViewRenderer;

    beforeEach(() => {
      renderer = new MonthViewRenderer();
    });

    it('should render event data', () => {
      const renderData = renderer.render(mockEvent, 'month');

      expect(renderData).toBeDefined();
      expect(renderData.classes).toContain('event-month');
      expect(renderData.classes).toContain('event-event');
      expect(renderData.displayText).toBe('Test Event');
      expect(renderData.showTime).toBe(false);
      expect(renderData.isClickable).toBe(true);
    });

    it('should use event color in styles', () => {
      const renderData = renderer.render(mockEvent, 'month');

      expect(renderData.styles.backgroundColor).toBe('#0860c4');
    });

    it('should use default color when event has no color', () => {
      const eventWithoutColor: Event = {
        ...mockEvent,
        color: undefined
      };

      const renderData = renderer.render(eventWithoutColor, 'month');

      expect(renderData.styles.backgroundColor).toBe('#0860c4');
    });

    it('should calculate layout', () => {
      const layout = renderer.calculateLayout(mockEvent, 'month');

      expect(layout).toBeDefined();
      expect(layout.top).toBeDefined();
      expect(layout.left).toBeDefined();
      expect(layout.width).toBeDefined();
      expect(layout.height).toBeDefined();
      expect(layout.zIndex).toBeDefined();
    });
  });

  describe('WeekViewRenderer', () => {
    let renderer: WeekViewRenderer;

    beforeEach(() => {
      renderer = new WeekViewRenderer();
    });

    it('should render event data with time displayed', () => {
      const renderData = renderer.render(mockEvent, 'week');

      expect(renderData.classes).toContain('event-week');
      expect(renderData.showTime).toBe(true);
    });

    it('should calculate layout', () => {
      const layout = renderer.calculateLayout(mockEvent, 'week');

      expect(layout).toBeDefined();
    });
  });

  describe('DayViewRenderer', () => {
    let renderer: DayViewRenderer;

    beforeEach(() => {
      renderer = new DayViewRenderer();
    });

    it('should render event data with time displayed', () => {
      const renderData = renderer.render(mockEvent, 'day');

      expect(renderData.classes).toContain('event-day');
      expect(renderData.showTime).toBe(true);
    });

    it('should calculate layout', () => {
      const layout = renderer.calculateLayout(mockEvent, 'day');

      expect(layout).toBeDefined();
    });
  });

  describe('ResourceViewRenderer', () => {
    let renderer: ResourceViewRenderer;

    beforeEach(() => {
      renderer = new ResourceViewRenderer();
    });

    it('should render event data with time displayed', () => {
      const renderData = renderer.render(mockEvent, 'resource');

      expect(renderData.classes).toContain('event-resource');
      expect(renderData.showTime).toBe(true);
    });

    it('should calculate layout', () => {
      const layout = renderer.calculateLayout(mockEvent, 'resource');

      expect(layout).toBeDefined();
    });
  });
});
