import { ViewMode } from '../models/config-schedule';
import { AnyEvent } from '../models/event';

/**
 * Abstract base class for event renderers.
 * Implements the Strategy pattern to handle view-specific rendering logic.
 */
export abstract class EventRenderer {
  /**
   * Renders an event for a specific view mode
   * @param event The event to render
   * @param viewMode The current view mode
   * @returns Rendering data/instructions for the view
   */
  abstract render(event: AnyEvent, viewMode: ViewMode): EventRenderData;

  /**
   * Calculates the position and dimensions of an event in the view
   * @param event The event to position
   * @param viewMode The current view mode
   * @returns Position and dimension data
   */
  abstract calculateLayout(event: AnyEvent, viewMode: ViewMode): EventLayout;
}

/**
 * Data structure for event rendering
 */
export interface EventRenderData {
  /** CSS classes to apply */
  classes: string[];

  /** Inline styles to apply */
  styles: Record<string, string>;

  /** Display text (may be truncated based on view) */
  displayText: string;

  /** Whether to show time in the event */
  showTime: boolean;

  /** Whether the event is clickable */
  isClickable: boolean;
}

/**
 * Layout information for positioning an event
 */
export interface EventLayout {
  /** Top position (px or %) */
  top: number;

  /** Left position (px or %) */
  left: number;

  /** Width (px or %) */
  width: number;

  /** Height (px or %) */
  height: number;

  /** Z-index for stacking */
  zIndex: number;

  /** Grid column span (for grid-based layouts) */
  columnSpan?: number;

  /** Grid row span (for grid-based layouts) */
  rowSpan?: number;
}

/**
 * Month view renderer implementation
 */
export class MonthViewRenderer extends EventRenderer {
  render(event: AnyEvent, viewMode: ViewMode): EventRenderData {
    return {
      classes: ['event-month', `event-${event.type}`],
      styles: {
        backgroundColor: event.color || '#0860c4',
      },
      displayText: event.title,
      showTime: false,
      isClickable: true,
    };
  }

  calculateLayout(event: AnyEvent, viewMode: ViewMode): EventLayout {
    // Placeholder implementation - will be enhanced with actual logic
    return {
      top: 0,
      left: 0,
      width: 100,
      height: 20,
      zIndex: 1,
    };
  }
}

/**
 * Week view renderer implementation
 */
export class WeekViewRenderer extends EventRenderer {
  render(event: AnyEvent, viewMode: ViewMode): EventRenderData {
    return {
      classes: ['event-week', `event-${event.type}`],
      styles: {
        backgroundColor: event.color || '#0860c4',
      },
      displayText: event.title,
      showTime: true,
      isClickable: true,
    };
  }

  calculateLayout(event: AnyEvent, viewMode: ViewMode): EventLayout {
    // Placeholder implementation - will be enhanced with actual logic
    return {
      top: 0,
      left: 0,
      width: 100,
      height: 60,
      zIndex: 1,
    };
  }
}

/**
 * Day view renderer implementation
 */
export class DayViewRenderer extends EventRenderer {
  render(event: AnyEvent, viewMode: ViewMode): EventRenderData {
    return {
      classes: ['event-day', `event-${event.type}`],
      styles: {
        backgroundColor: event.color || '#0860c4',
      },
      displayText: event.title,
      showTime: true,
      isClickable: true,
    };
  }

  calculateLayout(event: AnyEvent, viewMode: ViewMode): EventLayout {
    // Placeholder implementation - will be enhanced with actual logic
    return {
      top: 0,
      left: 0,
      width: 100,
      height: 80,
      zIndex: 1,
    };
  }
}

/**
 * Resource view renderer implementation
 */
export class ResourceViewRenderer extends EventRenderer {
  render(event: AnyEvent, viewMode: ViewMode): EventRenderData {
    return {
      classes: ['event-resource', `event-${event.type}`],
      styles: {
        backgroundColor: event.color || '#0860c4',
      },
      displayText: event.title,
      showTime: true,
      isClickable: true,
    };
  }

  calculateLayout(event: AnyEvent, viewMode: ViewMode): EventLayout {
    // Placeholder implementation - will be enhanced with actual logic
    return {
      top: 0,
      left: 0,
      width: 100,
      height: 60,
      zIndex: 1,
    };
  }
}

/**
 * Factory for creating view-specific renderers.
 * Implements the Factory pattern.
 */
export class EventRendererFactory {
  private static renderers = new Map<ViewMode, EventRenderer>([
    ['month', new MonthViewRenderer()],
    ['week', new WeekViewRenderer()],
    ['day', new DayViewRenderer()],
    ['resource', new ResourceViewRenderer()],
  ]);

  /**
   * Gets the appropriate renderer for a view mode
   * @param viewMode The current view mode
   * @returns The renderer for that view mode
   */
  static getRenderer(viewMode: ViewMode): EventRenderer {
    const renderer = this.renderers.get(viewMode);
    if (!renderer) {
      throw new Error(`No renderer found for view mode: ${viewMode}`);
    }
    return renderer;
  }
}
