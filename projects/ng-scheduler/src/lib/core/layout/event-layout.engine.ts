/**
 * @fileoverview Event Layout Engine - Collision Detection and Positioning
 * @module ng-scheduler/layout
 */

import { Injectable } from '@angular/core';
import { AnyEvent, Event } from '../models/event';

/**
 * Collision group with column assignments
 */
export interface CollisionGroup {
  events: AnyEvent[];
  columns: number;
  assignments: Map<string, number>; // eventId -> column index
}

/**
 * Calculated event bounds
 */
export interface EventBounds {
  width: number;
  left: number;
}

/**
 * Event Layout Engine
 * 
 * Handles collision detection and column assignment for overlapping events.
 * Uses an algorithm similar to Google Calendar for efficient layout.
 */
@Injectable({ providedIn: 'root' })
export class EventLayoutEngine {
  /**
   * Calculates layout for a list of events, detecting collisions
   * and assigning columns to overlapping events
   */
  calculateLayout(events: AnyEvent[], date: Date): CollisionGroup[] {
    // Filter events for the specific date and sort by start time
    const relevantEvents = this.filterEventsForDate(events, date);
    const sorted = this.sortByStartTime(relevantEvents);

    // Group events that collide
    const groups = this.findCollisionGroups(sorted);

    // Assign columns to each group
    return groups.map(group => {
      const assignments = new Map<string, number>();
      const columns = this.assignColumns(group, assignments);

      return { events: group, columns, assignments };
    });
  }

  /**
   * Calculates the width and position based on column assignment
   */
  calculateEventBounds(
    event: AnyEvent,
    column: number,
    totalColumns: number,
    cellWidth: number
  ): EventBounds {
    const width = cellWidth / totalColumns;
    const left = column * width;

    return { width, left };
  }

  /**
   * Filters events that occur on a specific date
   */
  private filterEventsForDate(events: AnyEvent[], date: Date): AnyEvent[] {
    const targetDay = this.startOfDay(date);

    return events.filter(event => {
      if (event.type !== 'event') return false;

      const regularEvent = event as Event;
      const eventStart = this.startOfDay(regularEvent.start);
      const eventEnd = this.startOfDay(regularEvent.end);

      return targetDay >= eventStart && targetDay <= eventEnd;
    });
  }

  /**
   * Sorts events by start time (earlier first)
   */
  private sortByStartTime(events: AnyEvent[]): AnyEvent[] {
    return [...events].sort((a, b) => {
      const aStart = this.getEventStart(a);
      const bStart = this.getEventStart(b);
      return aStart.getTime() - bStart.getTime();
    });
  }

  /**
   * Finds groups of events that collide with each other
   */
  private findCollisionGroups(events: AnyEvent[]): AnyEvent[][] {
    const groups: AnyEvent[][] = [];
    let currentGroup: AnyEvent[] = [];
    let groupEnd: Date = new Date(0);

    for (const event of events) {
      const eventStart = this.getEventStart(event);
      const eventEnd = this.getEventEnd(event);

      if (eventStart >= groupEnd) {
        // New group - no overlap with previous
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [event];
        groupEnd = eventEnd;
      } else {
        // Same group - overlaps with current group
        currentGroup.push(event);
        // Extend group end if this event ends later
        if (eventEnd > groupEnd) {
          groupEnd = eventEnd;
        }
      }
    }

    // Don't forget the last group
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * Assigns columns to events in a collision group
   * Returns the total number of columns needed
   */
  private assignColumns(
    events: AnyEvent[],
    assignments: Map<string, number>
  ): number {
    // Track when each column becomes available
    const columnEndTimes: Date[] = [];

    for (const event of events) {
      const eventStart = this.getEventStart(event);
      const eventEnd = this.getEventEnd(event);

      // Find the first available column
      let column = 0;
      while (
        column < columnEndTimes.length &&
        columnEndTimes[column] > eventStart
      ) {
        column++;
      }

      // Assign this event to the column
      assignments.set(event.id, column);

      // Update or add the column end time
      if (column < columnEndTimes.length) {
        columnEndTimes[column] = eventEnd;
      } else {
        columnEndTimes.push(eventEnd);
      }
    }

    return columnEndTimes.length;
  }

  private getEventStart(event: AnyEvent): Date {
    if (event.type === 'event') {
      return (event as Event).start;
    }
    throw new Error('Unsupported event type');
  }

  private getEventEnd(event: AnyEvent): Date {
    if (event.type === 'event') {
      return (event as Event).end;
    }
    throw new Error('Unsupported event type');
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }
}
