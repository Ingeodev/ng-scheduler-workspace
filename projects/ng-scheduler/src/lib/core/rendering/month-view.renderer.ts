/**
 * @fileoverview Month View Event Renderer
 * @module ng-scheduler/rendering
 */

import { EventRenderer, EventRenderData, EventSlice } from './event-renderer';
import { AnyEvent, Event, AllDayEvent } from '../models/event';

/**
 * Month View Renderer
 * 
 * Renders events as horizontal bars in a monthly calendar grid.
 * Multi-day events span across multiple cells.
 */
export class MonthViewRenderer extends EventRenderer {
  private readonly EVENT_HEIGHT_EM = 1.5;  // em units per event slot
  private readonly DAY_NUMBER_HEIGHT = 24; // Space reserved for day number at top
  private readonly DAY_WIDTH_PERCENT = 100 / 7; // 14.2857% per day
  private readonly EVENT_SPACING_XS = 4; // Gap between events in pixels

  render(
    event: AnyEvent,
    viewDate: Date,
    cellDimensions?: { width: number; height: number },
    slotIndex?: number
  ): EventRenderData {
    // Use provided dimensions or fallback to defaults
    const cellHeight = cellDimensions?.height || 76;

    const isMultiDay = this.isMultiDay(event);
    const slices = isMultiDay ? this.calculateSlices(event, viewDate) : undefined;

    // Get event dates
    const startDate = this.getEventStart(event);
    const endDate = this.getEventEnd(event);

    // Calculate position in month grid
    const startDayOfWeek = this.getDayOfWeek(startDate);
    const weekOfMonth = this.getWeekOfMonth(startDate);

    // Calculate duration in days (for width)
    const durationDays = this.calculateDurationDays(startDate, endDate);

    // Use percentage-based positioning for X axis (Google Calendar style)
    const leftPercent = startDayOfWeek * this.DAY_WIDTH_PERCENT;
    const widthPercent = durationDays * this.DAY_WIDTH_PERCENT;

    // Convert em to pixels for Y positioning with spacing between events
    // Note: We use pixels for top to avoid unit mixing issues
    const emToPx = 24; // Approximate conversion (1.5em * 16px base font = 24px)
    const slotHeight = emToPx + this.EVENT_SPACING_XS; // Event height + gap
    const slotOffsetPx = (slotIndex !== undefined ? slotIndex : 0) * slotHeight;

    return {
      position: {
        left: `${leftPercent.toFixed(4)}%`,    // Percentage for X (14.2857%)
        top: weekOfMonth * cellHeight + this.DAY_NUMBER_HEIGHT + slotOffsetPx, // px for Y
        width: `${widthPercent.toFixed(4)}%`,  // Percentage for width
        height: `${this.EVENT_HEIGHT_EM}em`    // em for height
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
      isSelected: false
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
