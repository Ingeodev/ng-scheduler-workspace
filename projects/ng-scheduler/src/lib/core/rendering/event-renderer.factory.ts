/**
 * @fileoverview Event Renderer Factory
 * @module ng-scheduler/rendering
 */

import { EventRenderer } from './event-renderer';
import { MonthViewRenderer } from './month-view.renderer';
import { WeekViewRenderer } from './week-view.renderer';
import { DayViewRenderer } from './day-view.renderer';
import { ViewMode } from '../models/config-schedule';

/**
 * Factory for creating event renderers (Factory Pattern)
 * 
 * Provides a centralized way to obtain the correct renderer
 * based on the current view mode. Caches instances for performance.
 */
export class EventRendererFactory {
  private static renderers = new Map<ViewMode, EventRenderer>();

  /**
   * Gets the appropriate renderer for the view mode
   * @param viewMode - The current view mode
   * @returns The event renderer instance
   * @throws Error if view mode is invalid
   */
  static getRenderer(viewMode: ViewMode): EventRenderer {
    // Return cached instance if exists
    if (this.renderers.has(viewMode)) {
      return this.renderers.get(viewMode)!;
    }

    // Create new instance based on view mode
    let renderer: EventRenderer;

    switch (viewMode) {
      case 'month':
        renderer = new MonthViewRenderer();
        break;
      case 'week':
        renderer = new WeekViewRenderer();
        break;
      case 'day':
      case 'resource':
        renderer = new DayViewRenderer();
        break;
      default:
        throw new Error(`Invalid view mode: ${viewMode}`);
    }

    // Cache and return
    this.renderers.set(viewMode, renderer);
    return renderer;
  }

  /**
   * Clears the renderer cache (useful for testing)
   */
  static clearCache(): void {
    this.renderers.clear();
  }
}
