/**
 * @fileoverview Week View Event Renderer
 * @module ng-scheduler/rendering
 */

import { EventRenderer, EventRenderData, EventSlice } from './event-renderer';
import { AnyEvent, Event } from '../models/event';

/**
 * Week View Renderer
 * 
 * Renders events as time-based blocks in a weekly time grid.
 * Height is proportional to event duration.
 */
export class WeekViewRenderer extends EventRenderer {
  private readonly HOUR_HEIGHT = 100; // pixels per hour (50px per 30min slot)
  private readonly DAY_START_HOUR = 0; // 12 AM

  render(
    event: AnyEvent,
    viewDate: Date,
    cellDimensions?: { width: number; height: number }
  ): EventRenderData {
    if (event.type !== 'event') {
      throw new Error('WeekViewRenderer only supports regular events');
    }

    const columnWidth = cellDimensions?.width || 140;

    const regularEvent = event as Event;
    const isMultiDay = this.isMultiDay(event);
    const slices = isMultiDay ? this.calculateSlices(event, viewDate) : undefined;

    // Calculate vertical position based on start time
    const startHour = regularEvent.start.getHours();
    const startMinute = regularEvent.start.getMinutes();
    const topPosition = (startHour - this.DAY_START_HOUR) * this.HOUR_HEIGHT +
      (startMinute / 60) * this.HOUR_HEIGHT;

    // Calculate height based on duration
    const durationMs = regularEvent.end.getTime() - regularEvent.start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const height = durationHours * this.HOUR_HEIGHT;

    // Calculate horizontal position based on day of week
    const dayOfWeek = this.getDayOfWeek(regularEvent.start);
    const leftPosition = dayOfWeek * columnWidth;

    return {
      position: {
        left: leftPosition,
        top: topPosition,
        width: columnWidth,
        height: height
      },
      zIndex: 1,
      slices,
      layout: {
        column: dayOfWeek,
        overlap: 0,
        totalOverlaps: 1
      },
      isResizing: false,
      isDragging: false,
      isHovered: false,
      isSelected: false
    };
  }

  calculateSlices(event: AnyEvent, viewDate: Date): EventSlice[] {
    if (!this.isMultiDay(event) || event.type !== 'event') {
      return [];
    }

    const regularEvent = event as Event;
    const slices: EventSlice[] = [];

    let currentDate = this.startOfDay(regularEvent.start);
    const endDate = this.startOfDay(regularEvent.end);

    while (currentDate <= endDate) {
      const isStart = this.isSameDay(currentDate, regularEvent.start);
      const isEnd = this.isSameDay(currentDate, regularEvent.end);

      slices.push({
        id: `${event.id}-${this.formatDate(currentDate)}`,
        eventId: event.id,
        date: new Date(currentDate),
        startTime: isStart ? regularEvent.start : this.startOfDay(currentDate),
        endTime: isEnd ? regularEvent.end : this.endOfDay(currentDate),
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
    // Week view snaps to 15-minute intervals
    const snapPoints: Date[] = [];
    const dayStart = this.startOfDay(date);

    // Create snap points every 15 minutes for 24 hours
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const snapPoint = new Date(dayStart);
        snapPoint.setHours(hour, minute, 0, 0);
        snapPoints.push(snapPoint);
      }
    }

    return snapPoints;
  }
}
