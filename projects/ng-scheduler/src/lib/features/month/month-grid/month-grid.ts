import { Component, input, computed, viewChild, ElementRef, inject } from '@angular/core';
import { getMonthCalendarGrid, CalendarWeek } from '../../../shared/helpers';
import { MonthCell } from '../month-cell/month-cell';
import { Selection } from '../../../shared/components/selection/selection';
import { Selectable, SelectableDirective, SelectionResult } from '../../../shared/dirrectives/select';

/**
 * Month calendar grid component that displays a full month view with weeks and days.
 * 
 * Implements the Selectable interface to enable date selection via mouse interaction.
 * Uses the SelectableDirective to handle all selection logic.
 * 
 * Features:
 * - Displays 6 weeks (always consistent height)
 * - Shows padding days from previous/next months
 * - Supports mouse-based date range selection
 * - Emits selection events with date ranges
 * 
 * @example
 * ```html
 * <mglon-month-grid 
 *   [currentDate]="selectedDate"
 *   (selectionEnd)="onDateRangeSelected($event)">
 * </mglon-month-grid>
 * ```
 */
@Component({
  selector: 'mglon-month-grid',
  imports: [MonthCell, Selection, SelectableDirective],
  templateUrl: './month-grid.html',
  styleUrl: './month-grid.scss',
})
export class MonthGrid implements Selectable {
  private readonly elementRef = inject(ElementRef);

  /**
   * Reference to the SelectableDirective instance.
   * Used to access selection state (selection rectangle and isSelecting flag).
   */
  readonly selectableDirective = viewChild(SelectableDirective);

  /**
   * The date to display the calendar for.
   * Can be any date within the target month.
   * @default new Date() (current month)
   */
  readonly currentDate = input<Date>(new Date());

  /**
   * Computed calendar grid for the current month.
   * Automatically updates when currentDate changes.
   * Returns an array of weeks, each containing 7 days.
   */
  readonly weeks = computed<CalendarWeek[]>(() => {
    return getMonthCalendarGrid(this.currentDate());
  });

  /**
   * Implements Selectable.getDateFromPoint()
   * 
   * Translates visual coordinates (relative to the grid container) into a calendar date.
   * This enables the SelectableDirective to determine which date the user is selecting.
   * 
   * Algorithm:
   * 1. Convert relative coordinates to absolute viewport coordinates
   * 2. Use document.elementFromPoint to find the cell element under the cursor
   * 3. Extract the date from the cell's data-date attribute
   * 4. Find and return the corresponding CalendarDay object
   * 
   * @param x - X coordinate relative to the grid container
   * @param y - Y coordinate relative to the grid container
   * @returns Object with date property, or null if no date found at coordinates
   */
  getDateFromPoint(x: number, y: number): { date: Date; resourceId?: string } | null {
    // Convert relative coordinates to absolute viewport coordinates
    const absoluteCoords = this.getAbsoluteCoordinates(x, y);
    if (!absoluteCoords) return null;

    // Find the calendar cell element at the cursor position
    const cellElement = this.findCellElementAtPoint(absoluteCoords.x, absoluteCoords.y);
    if (!cellElement) return null;

    // Extract and parse the date from the cell
    const date = this.extractDateFromCell(cellElement);
    if (!date) return null;

    return { date };
  }

  /**
   * Converts coordinates relative to the grid to absolute viewport coordinates
   * 
   * @param relativeX - X coordinate relative to grid container
   * @param relativeY - Y coordinate relative to grid container
   * @returns Absolute coordinates or null if grid element not found
   */
  private getAbsoluteCoordinates(relativeX: number, relativeY: number): { x: number; y: number } | null {
    const gridElement = this.elementRef.nativeElement as HTMLElement;
    if (!gridElement) return null;

    const gridRect = gridElement.getBoundingClientRect();

    return {
      x: gridRect.left + relativeX,
      y: gridRect.top + relativeY
    };
  }

  /**
   * Finds the month cell element at the given viewport coordinates
   * 
   * @param absoluteX - Absolute X coordinate in viewport
   * @param absoluteY - Absolute Y coordinate in viewport
   * @returns The mglon-month-cell element or null if not found
   */
  private findCellElementAtPoint(absoluteX: number, absoluteY: number): Element | null {
    const element = document.elementFromPoint(absoluteX, absoluteY);
    if (!element) return null;

    // Walk up the DOM tree to find the month-cell element
    return element.closest('mglon-month-cell');
  }

  /**
   * Extracts the date from a month cell element's data attribute
   * 
   * @param cellElement - The mglon-month-cell element
   * @returns The date object or null if date attribute is missing/invalid
   */
  private extractDateFromCell(cellElement: Element): Date | null {
    const dateStr = cellElement.getAttribute('data-date');
    if (!dateStr) return null;

    // Parse the ISO date string and find the matching CalendarDay
    const targetDate = new Date(dateStr);

    // Search through weeks to find the matching day
    for (const week of this.weeks()) {
      const day = week.days.find(d => d.date.getTime() === targetDate.getTime());
      if (day) {
        return day.date;
      }
    }

    return null;
  }

  /**
   * Handles the start of a selection operation
   * @param result - Selection result containing start and end dates
   */
  onSelectionStart(result: SelectionResult): void {
    console.log('Selection started:', result);
  }

  /**
   * Handles changes to an ongoing selection
   * @param result - Selection result with updated end date
   */
  onSelectionChange(result: SelectionResult): void {
    console.log('Selection changed:', result);
  }

  /**
   * Handles the completion of a selection operation
   * @param result - Final selection result with start and end dates
   */
  onSelectionEnd(result: SelectionResult): void {
    console.log('Selection ended:', result);
  }
}
