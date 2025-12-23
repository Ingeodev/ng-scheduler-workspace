/**
 * @fileoverview Month View Event Renderer
 * @module ng-scheduler/rendering
 */

import { EventRenderer, EventRenderData, EventSlice } from './event-renderer';
import { AnyEvent, Event, AllDayEvent } from '../models/event';
import { MONTH_VIEW_LAYOUT } from '../config/month-view.config';

/**
 * Month View Renderer
 * 
 * Renders events as horizontal bars in a monthly calendar grid.
 * Multi-day events span across multiple cells.
 */
export class MonthViewRenderer extends EventRenderer {
  private readonly EVENT_HEIGHT_EM = MONTH_VIEW_LAYOUT.EVENT_HEIGHT_EM;
  private readonly DAY_NUMBER_HEIGHT = MONTH_VIEW_LAYOUT.DAY_NUMBER_HEIGHT;
  private readonly DAY_WIDTH_PERCENT = MONTH_VIEW_LAYOUT.DAY_WIDTH_PERCENT;
  private readonly EVENT_SPACING_XS = MONTH_VIEW_LAYOUT.EVENT_SPACING_XS;

  render(
    event: AnyEvent,
    viewDate: Date,
    cellDimensions?: { width: number; height: number },
    slotIndex?: number,
    viewBoundaries?: { start: Date; end: Date }
  ): EventRenderData {
    // Use provided dimensions or fallback to defaults
    const cellHeight = cellDimensions?.height || 76;

    const isMultiDay = this.isMultiDay(event);
    const slices = isMultiDay ? this.calculateSlices(event, viewDate) : undefined;

    // Get event dates
    const startDate = this.getEventStart(event);
    const endDate = this.getEventEnd(event);

    // Calculate effective start/end based on view boundaries
    let effectiveStart = startDate;
    let effectiveEnd = endDate;
    let isStart = true;
    let isEnd = true;

    if (viewBoundaries) {
      if (startDate < viewBoundaries.start) {
        effectiveStart = viewBoundaries.start;
        isStart = false; // Started before this view
      }
      if (endDate > viewBoundaries.end) {
        effectiveEnd = viewBoundaries.end;
        isEnd = false; // Ends after this view
      }
    }

    // Calculate position in month grid using effective dates
    const startDayOfWeek = this.getDayOfWeek(effectiveStart);
    const weekOfMonth = this.getWeekOfMonth(effectiveStart); // Relative to clamped start

    // Calculate duration in days (for width)
    const durationDays = this.calculateDurationDays(effectiveStart, effectiveEnd);

    // Use percentage-based positioning for X axis (Google Calendar style)
    const leftPercent = startDayOfWeek * this.DAY_WIDTH_PERCENT;
    const widthPercent = durationDays * this.DAY_WIDTH_PERCENT;

    // Convert em to pixels for Y positioning
    const emToPx = MONTH_VIEW_LAYOUT.EM_TO_PX_RATIO;
    const slotHeight = emToPx + this.EVENT_SPACING_XS;
    const slotOffsetPx = (slotIndex !== undefined ? slotIndex : 0) * slotHeight;

    return {
      position: {
        left: `${leftPercent.toFixed(4)}%`,
        top: weekOfMonth * cellHeight + this.DAY_NUMBER_HEIGHT + slotOffsetPx,
        width: `${widthPercent.toFixed(4)}%`,
        height: `${this.EVENT_HEIGHT_EM}em`
      },
      zIndex: 1,
      slices,
      layout: {
        column: startDayOfWeek,
        overlap: slotIndex || 0,
        totalOverlaps: (slotIndex || 0) + 1
      },
      isResizing: false,
      isDragging: false,
      isHovered: false,
      isSelected: false,
      isStart,
      isEnd
    };
  }

  calculateSlices(event: AnyEvent, viewDate: Date): EventSlice[] {
    if (!this.isMultiDay(event)) {
      return [];
    }

    const slices: EventSlice[] = [];
    const startDate = this.getEventStart(event);
    const endDate = this.getEventEnd(event);

    let currentDate = this.startOfDay(startDate);
    const lastDate = this.startOfDay(endDate);

    while (currentDate <= lastDate) {
      const isStart = this.isSameDay(currentDate, startDate);
      const isEnd = this.isSameDay(currentDate, endDate);

      slices.push({
        id: `${event.id}-${this.formatDate(currentDate)}`,
        eventId: event.id,
        date: new Date(currentDate),
        startTime: isStart ? startDate : this.startOfDay(currentDate),
        endTime: isEnd ? endDate : this.endOfDay(currentDate),
        isStart,
        isEnd,
        position: {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
      });

      currentDate = this.addDays(currentDate, 1);
    }

    return slices;
  }

  getSnapPoints(date: Date): Date[] {
    // In month view, snap to day boundaries
    const snapPoints: Date[] = [];
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let current = this.startOfDay(monthStart);
    while (current <= monthEnd) {
      snapPoints.push(new Date(current));
      current = this.addDays(current, 1);
    }

    return snapPoints;
  }

  private getEventStart(event: AnyEvent): Date {
    if (event.type === 'all-day') {
      return (event as AllDayEvent).date;
    }
    return (event as Event).start;
  }

  private getEventEnd(event: AnyEvent): Date {
    if (event.type === 'all-day') {
      const allDay = event as AllDayEvent;
      return allDay.endDate || allDay.date;
    }
    return (event as Event).end;
  }

  private calculateDurationDays(start: Date, end: Date): number {
    const startDay = this.startOfDay(start);
    const endDay = this.startOfDay(end);
    const diffMs = endDay.getTime() - startDay.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1); // +1 to include both start and end days
  }
}
