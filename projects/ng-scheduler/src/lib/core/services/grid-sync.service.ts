/**
 * @fileoverview Grid Synchronization Service
 * @module ng-scheduler/services
 */

import { Injectable, DestroyRef, inject } from '@angular/core';
import { signal, computed, Signal } from '@angular/core';

/**
 * Grid bounds information
 */
export interface GridBounds {
  width: number;
  height: number;
  scrollTop: number;
  scrollLeft: number;
  cellWidth: number;
  cellHeight: number;
}

/**
 * Grid Sync Service
 * 
 * Manages synchronization between the calendar grid and event overlays.
 * Handles scroll events, resize observations, and provides reactive grid state.
 */
@Injectable({ providedIn: 'root' })
export class GridSyncService {
  private destroyRef = inject(DestroyRef);
  private resizeObserver?: ResizeObserver;
  private scrollListeners: Map<HTMLElement, () => void> = new Map();

  // Reactive grid state
  private gridBoundsSignal = signal<GridBounds>({
    width: 0,
    height: 0,
    scrollTop: 0,
    scrollLeft: 0,
    cellWidth: 0,
    cellHeight: 0
  });

  /**
   * Public reactive grid bounds
   */
  readonly gridBounds: Signal<GridBounds> = computed(() => this.gridBoundsSignal());

  /**
   * Observes grid element for size changes
   * 
   * @param gridElement - The grid element to observe
   * @param calculateCellSize - Function to calculate cell dimensions
   * @returns Cleanup function
   */
  observeGrid(
    gridElement: HTMLElement,
    calculateCellSize: (bounds: DOMRect) => { width: number; height: number }
  ): () => void {
    // Create resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      const rect = entry.contentRect;
      const cellSize = calculateCellSize(rect);

      this.gridBoundsSignal.update(bounds => ({
        ...bounds,
        width: rect.width,
        height: rect.height,
        cellWidth: cellSize.width,
        cellHeight: cellSize.height
      }));
    });

    this.resizeObserver.observe(gridElement);

    // Initial measurement
    const rect = gridElement.getBoundingClientRect();
    const cellSize = calculateCellSize(rect);
    this.gridBoundsSignal.update(bounds => ({
      ...bounds,
      width: rect.width,
      height: rect.height,
      cellWidth: cellSize.width,
      cellHeight: cellSize.height
    }));

    // Return cleanup function
    return () => {
      this.resizeObserver?.disconnect();
      this.resizeObserver = undefined;
    };
  }

  /**
   * Synchronizes scroll between grid and events container
   * 
   * @param gridElement - The scrollable grid element
   * @param eventsContainer - The events overlay container
   * @returns Cleanup function
   */
  syncScroll(
    gridElement: HTMLElement,
    eventsContainer: HTMLElement
  ): () => void {
    const handleScroll = () => {
      const scrollTop = gridElement.scrollTop;
      const scrollLeft = gridElement.scrollLeft;

      // Update signal
      this.gridBoundsSignal.update(bounds => ({
        ...bounds,
        scrollTop,
        scrollLeft
      }));

      // Sync events container using transform for performance
      eventsContainer.style.transform =
        `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`;
    };

    gridElement.addEventListener('scroll', handleScroll, { passive: true });
    this.scrollListeners.set(gridElement, handleScroll);

    // Return cleanup function
    return () => {
      gridElement.removeEventListener('scroll', handleScroll);
      this.scrollListeners.delete(gridElement);
    };
  }

  /**
   * Converts a date/time to pixel position within the grid
   * 
   * @param date - The date/time to convert
   * @param viewMode - Current view mode
   * @returns Pixel coordinates { x, y }
   */
  dateToPosition(date: Date, viewMode: 'month' | 'week' | 'day'): { x: number; y: number } {
    const bounds = this.gridBoundsSignal();

    switch (viewMode) {
      case 'month':
        return this.dateToPositionMonth(date, bounds);
      case 'week':
        return this.dateToPositionWeek(date, bounds);
      case 'day':
        return this.dateToPositionDay(date, bounds);
    }
  }

  /**
   * Converts pixel position to date/time
   * 
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param viewMode - Current view mode
   * @param referenceDate - Reference date for the view
   * @returns Date object
   */
  positionToDate(
    x: number,
    y: number,
    viewMode: 'month' | 'week' | 'day',
    referenceDate: Date
  ): Date {
    const bounds = this.gridBoundsSignal();

    switch (viewMode) {
      case 'month':
        return this.positionToDateMonth(x, y, bounds, referenceDate);
      case 'week':
        return this.positionToDateWeek(x, y, bounds, referenceDate);
      case 'day':
        return this.positionToDateDay(x, y, bounds, referenceDate);
    }
  }

  private dateToPositionMonth(date: Date, bounds: GridBounds): { x: number; y: number } {
    const dayOfWeek = date.getDay();
    const weekOfMonth = this.getWeekOfMonth(date);

    return {
      x: dayOfWeek * bounds.cellWidth,
      y: weekOfMonth * bounds.cellHeight
    };
  }

  private dateToPositionWeek(date: Date, bounds: GridBounds): { x: number; y: number } {
    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hourHeight = bounds.cellHeight; // Assuming cellHeight is per hour

    return {
      x: dayOfWeek * bounds.cellWidth,
      y: hours * hourHeight + (minutes / 60) * hourHeight
    };
  }

  private dateToPositionDay(date: Date, bounds: GridBounds): { x: number; y: number } {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hourHeight = bounds.cellHeight;

    return {
      x: 0,
      y: hours * hourHeight + (minutes / 60) * hourHeight
    };
  }

  private positionToDateMonth(
    x: number,
    y: number,
    bounds: GridBounds,
    referenceDate: Date
  ): Date {
    const dayOfWeek = Math.floor(x / bounds.cellWidth);
    const weekOfMonth = Math.floor(y / bounds.cellHeight);

    const firstDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const daysToAdd = weekOfMonth * 7 + dayOfWeek - firstDay.getDay();

    const result = new Date(firstDay);
    result.setDate(firstDay.getDate() + daysToAdd);
    return result;
  }

  private positionToDateWeek(
    x: number,
    y: number,
    bounds: GridBounds,
    referenceDate: Date
  ): Date {
    const dayOfWeek = Math.floor(x / bounds.cellWidth);
    const hourHeight = bounds.cellHeight;
    const totalMinutes = (y / hourHeight) * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // Get start of week
    const weekStart = this.getWeekStart(referenceDate);
    const result = new Date(weekStart);
    result.setDate(weekStart.getDate() + dayOfWeek);
    result.setHours(hours, minutes, 0, 0);

    return result;
  }

  private positionToDateDay(
    x: number,
    y: number,
    bounds: GridBounds,
    referenceDate: Date
  ): Date {
    const hourHeight = bounds.cellHeight;
    const totalMinutes = (y / hourHeight) * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    const result = new Date(referenceDate);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private getWeekOfMonth(date: Date): number {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    const offsetDate = date.getDate() + firstDayOfWeek - 1;
    return Math.floor(offsetDate / 7);
  }

  private getWeekStart(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.scrollListeners.clear();
  }
}
