/**
 * @fileoverview Event Rendering System - Core Renderer Implementation
 * @module ng-scheduler/rendering
 */

import { AnyEvent, Event, AllDayEvent, RecurrentEvent } from '../models/event';
import { ViewMode } from '../models/config-schedule';

/**
 * Event slice for multi-day event rendering
 */
export interface EventSlice {
  id: string;
  eventId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isStart: boolean;
  isEnd: boolean;
  position: EventRenderData['position'];
}

/**
 * Complete render data for an event
 */
export interface EventRenderData {
  position: {
    top: number | string;    // px, em, or % (e.g., 100 or '14.28%' or '1.5em')
    left: number | string;   // px or % (e.g., 100 or '28.57%')
    width: number | string;  // px or % (e.g., 100 or '14.28%')
    height: number | string; // px or em (e.g., 20 or '1.5em')
  };
  zIndex: number;
  slices?: EventSlice[];
  layout: {
    column: number;
    overlap: number;
    totalOverlaps: number;
  };
  isResizing: boolean;
  isDragging: boolean;
  isHovered: boolean;
  isSelected: boolean;
}

/**
 * Abstract base class for event renderers (Strategy Pattern)
 * 
 * Each view mode (Month, Week, Day) has different rendering requirements,
 * so we use the Strategy pattern to encapsulate these differences.
 * 
 * @abstract
 */
export abstract class EventRenderer {
  /**
   * Renders an event for the specific view
   * @param event - The event to render
   * @param viewDate - The current view date
   * @param cellDimensions - Optional cell dimensions from the grid
   * @param slotIndex - Optional slot index for vertical stacking (Month view)
   * @returns Render data including position, layout, and metadata
   */
  abstract render(
    event: AnyEvent,
    viewDate: Date,
    cellDimensions?: { width: number; height: number },
    slotIndex?: number
  ): EventRenderData;

  /**
   * Calculates slices for multi-day events
   * @param event - The event to slice
   * @param viewDate - The current view date
   * @returns Array of event slices
   */
  abstract calculateSlices(event: AnyEvent, viewDate: Date): EventSlice[];

  /**
   * Gets snap points for the view (for drag & drop snapping)
   * @param date - Reference date for snap points
   * @returns Array of snap point dates
   */
  abstract getSnapPoints(date: Date): Date[];

  /**
   * Helper: Check if event spans multiple days
   */
  protected isMultiDay(event: AnyEvent): boolean {
    if (event.type === 'all-day') {
      const allDay = event as AllDayEvent;
      return !!allDay.endDate &&
        this.startOfDay(allDay.date).getTime() !== this.startOfDay(allDay.endDate).getTime();
    }

    if (event.type === 'event') {
      const regular = event as Event;
      return this.startOfDay(regular.start).getTime() !== this.startOfDay(regular.end).getTime();
    }

    return false;
  }

  /**
   * Helper: Get start of day
   */
  protected startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Helper: Get end of day
   */
  protected endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Helper: Check if two dates are the same day
   */
  protected isSameDay(date1: Date, date2: Date): boolean {
    return this.startOfDay(date1).getTime() === this.startOfDay(date2).getTime();
  }

  /**
   * Helper: Add days to a date
   */
  protected addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Helper: Format date as YYYY-MM-DD
   */
  protected formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper: Get day of week (0 = Sunday, 6 = Saturday)
   */
  protected getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  /**
   * Helper: Get week number of month
   */
  protected getWeekOfMonth(date: Date): number {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    const offsetDate = date.getDate() + firstDayOfWeek - 1;
    return Math.floor(offsetDate / 7);
  }
}
