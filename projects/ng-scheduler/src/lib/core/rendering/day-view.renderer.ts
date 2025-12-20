/**
 * @fileoverview Day View Event Renderer
 * @module ng-scheduler/rendering
 */

import { EventRenderer, EventRenderData, EventSlice } from './event-renderer';
import { AnyEvent, Event } from '../models/event';

/**
 * Day View Renderer
 * 
 * Similar to Week view but for a single day with more detail.
 * Uses finer time intervals for snapping.
 */
export class DayViewRenderer extends EventRenderer {
  private readonly HOUR_HEIGHT = 80; // pixels per hour (more detail than week)
  private readonly DAY_START_HOUR = 0;

  render(
    event: AnyEvent,
    viewDate: Date,
    cellDimensions?: { width: number; height: number }
  ): EventRenderData {
    if (event.type !== 'event') {
      throw new Error('DayViewRenderer only supports regular events');
    }

    const columnWidth = cellDimensions?.width || 600;

    const regularEvent = event as Event;

    // Calculate vertical position based on start time
    const startHour = regularEvent.start.getHours();
    const startMinute = regularEvent.start.getMinutes();
    const topPosition = (startHour - this.DAY_START_HOUR) * this.HOUR_HEIGHT +
      (startMinute / 60) * this.HOUR_HEIGHT;

    // Calculate height based on duration
    const durationMs = regularEvent.end.getTime() - regularEvent.start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const height = durationHours * this.HOUR_HEIGHT;

    return {
      position: {
        left: 0,
        top: topPosition,
        width: columnWidth,
        height: height
      },
      zIndex: 1,
      slices: undefined,
      layout: {
        column: 0,
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
    // Day view doesn't use slices (single day)
    return [];
  }

  getSnapPoints(date: Date): Date[] {
    // Day view snaps to 5-minute intervals for precision
    const snapPoints: Date[] = [];
    const dayStart = this.startOfDay(date);

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const snapPoint = new Date(dayStart);
        snapPoint.setHours(hour, minute, 0, 0);
        snapPoints.push(snapPoint);
      }
    }

    return snapPoints;
  }
}
