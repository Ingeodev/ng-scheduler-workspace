/**
 * @fileoverview Event Slot Assignment for Month View
 * @module ng-scheduler/core/rendering
 */

import { AnyEvent, Event, AllDayEvent } from '../models/event';

/**
 * Represents an event with its visual slot assignment
 */
export interface SlottedEvent {
  event: AnyEvent;
  slotIndex: number;     // Y position (0, 1, 2, etc.)
  dayStart: number;      // Day of week start (0-6)
  dayEnd: number;        // Day of week end (0-6)
  spanDays: number;      // Number of days the event spans
}

/**
 * Week bounds for grouping events
 */
export interface WeekBounds {
  weekStart: Date;
  weekEnd: Date;
  weekIndex: number;
}

/**
 * EventSlotAssigner
 * 
 * Implements a Tetris-like algorithm to assign vertical slots to events
 * within a week to prevent overlapping.
 * 
 * Algorithm:
 * 1. Sort events by duration (longer events first) and start time
 * 2. For each event, find the lowest available slot
 * 3. Mark occupied days in that slot
 * 4. Return events with assigned slotIndex
 * 
 * @example
 * ```typescript
 * const assigner = new EventSlotAssigner();
 * const slottedEvents = assigner.assignSlots(eventsInWeek, weekStart);
 * // Events now have slotIndex: 0, 1, 2, etc.
 * ```
 */
export class EventSlotAssigner {

  /**
   * Assigns slots to events for a single week
   * 
   * @param events - Events that occur in this week
   * @param weekStart - Start date of the week (Sunday)
   * @returns Events with assigned slot indices
   */
  assignSlots(events: AnyEvent[], weekStart: Date): SlottedEvent[] {
    if (events.length === 0) return [];

    // Sort events: longer duration first, then by start time
    const sortedEvents = this.sortEvents(events);

    // Track which days are occupied in each slot
    const slotOccupancy: boolean[][] = [];

    // Assign slots
    const slottedEvents: SlottedEvent[] = [];

    for (const event of sortedEvents) {
      const eventInfo = this.getEventBounds(event, weekStart);
      const slotIndex = this.findAvailableSlot(
        eventInfo.dayStart,
        eventInfo.dayEnd,
        slotOccupancy
      );

      // Mark days as occupied in this slot
      this.markOccupied(
        slotIndex,
        eventInfo.dayStart,
        eventInfo.dayEnd,
        slotOccupancy
      );

      slottedEvents.push({
        event,
        slotIndex,
        dayStart: eventInfo.dayStart,
        dayEnd: eventInfo.dayEnd,
        spanDays: eventInfo.dayEnd - eventInfo.dayStart + 1
      });
    }

    return slottedEvents;
  }

  /**
   * Sorts events by duration (descending) and start time (ascending)
   * Longer events get assigned slots first (less likely to cause fragmentation)
   */
  private sortEvents(events: AnyEvent[]): AnyEvent[] {
    return [...events].sort((a, b) => {
      const durationA = this.getEventDuration(a);
      const durationB = this.getEventDuration(b);

      // Sort by duration descending
      if (durationA !== durationB) {
        return durationB - durationA;
      }

      // If same duration, sort by start time ascending
      const startA = this.getEventStart(a).getTime();
      const startB = this.getEventStart(b).getTime();
      return startA - startB;
    });
  }

  /**
   * Gets event bounds relative to the week
   * 
   * @param event - The event to analyze
   * @param weekStart - Start of the week (Sunday)
   * @returns Day indices within the week (0-6)
   */
  private getEventBounds(
    event: AnyEvent,
    weekStart: Date
  ): { dayStart: number; dayEnd: number } {
    const eventStart = this.getEventStart(event);
    const eventEnd = this.getEventEnd(event);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Clamp to week boundaries
    const clampedStart = eventStart < weekStart ? weekStart : eventStart;
    const clampedEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

    // Calculate day of week (0 = Sunday, 6 = Saturday)
    const dayStart = this.getDayOfWeek(clampedStart);
    const dayEnd = this.getDayOfWeek(clampedEnd);

    return { dayStart, dayEnd };
  }

  /**
   * Finds the lowest available slot for the given day range
   * 
   * @param dayStart - Starting day index (0-6)
   * @param dayEnd - Ending day index (0-6)
   * @param slotOccupancy - 2D array tracking occupied slots
   * @returns Available slot index
   */
  private findAvailableSlot(
    dayStart: number,
    dayEnd: number,
    slotOccupancy: boolean[][]
  ): number {
    let slotIndex = 0;

    // Try each slot starting from 0
    while (true) {
      // Ensure this slot exists
      if (!slotOccupancy[slotIndex]) {
        slotOccupancy[slotIndex] = Array(7).fill(false);
      }

      // Check if all required days are free in this slot
      const isAvailable = this.isSlotAvailable(
        slotIndex,
        dayStart,
        dayEnd,
        slotOccupancy
      );

      if (isAvailable) {
        return slotIndex;
      }

      slotIndex++;
    }
  }

  /**
   * Checks if a slot is available for the given day range
   */
  private isSlotAvailable(
    slotIndex: number,
    dayStart: number,
    dayEnd: number,
    slotOccupancy: boolean[][]
  ): boolean {
    for (let day = dayStart; day <= dayEnd; day++) {
      if (slotOccupancy[slotIndex][day]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Marks days as occupied in a slot
   */
  private markOccupied(
    slotIndex: number,
    dayStart: number,
    dayEnd: number,
    slotOccupancy: boolean[][]
  ): void {
    if (!slotOccupancy[slotIndex]) {
      slotOccupancy[slotIndex] = Array(7).fill(false);
    }

    for (let day = dayStart; day <= dayEnd; day++) {
      slotOccupancy[slotIndex][day] = true;
    }
  }

  /**
   * Gets event duration in days
   */
  private getEventDuration(event: AnyEvent): number {
    const start = this.getEventStart(event);
    const end = this.getEventEnd(event);
    const diffMs = end.getTime() - start.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Gets event start date
   */
  private getEventStart(event: AnyEvent): Date {
    if (event.type === 'all-day') {
      return (event as AllDayEvent).date;
    }
    return (event as Event).start;
  }

  /**
   * Gets event end date
   */
  private getEventEnd(event: AnyEvent): Date {
    if (event.type === 'all-day') {
      const allDay = event as AllDayEvent;
      return allDay.endDate || allDay.date;
    }
    return (event as Event).end;
  }

  /**
   * Gets day of week (0 = Sunday, 6 = Saturday)
   */
  private getDayOfWeek(date: Date): number {
    return date.getDay();
  }
}
