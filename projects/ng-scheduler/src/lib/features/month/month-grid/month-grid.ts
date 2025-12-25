import { Component, input, computed, viewChild, ElementRef, inject } from '@angular/core'
import { getMonthCalendarGrid, CalendarWeek, isEventInRange } from '../../../shared/helpers'
import { MonthWeek } from '../month-week/month-week'
import { Selection } from '../../../core/background-selection/selection/selection'
import { Selectable, SelectableDirective, SelectionResult } from '../../../core/background-selection/selectable'
import { ResizeObserverDirective, ResizeEvent } from '../../../shared/directives/resize-observer.directive'
import { CalendarStore } from '../../../core/store/calendar.store'
import { IconButtonComponent } from '../../../shared/components/buttons/icon-button/icon-button'
import { IconComponent } from '../../../shared/components/icon/icon'
import { sliceEventsByWeek } from '../../../core/rendering/slicers/month'
import { CELL_HEADER_HEIGHT, SLOT_HEIGHT, SLOT_GAP } from '../../../core/config/default-schedule-config'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * Month calendar grid component that displays a full month view with weeks and days.
 * 
 * Implements the Selectable interface to enable date selection via mouse interaction.
 * Uses the SelectableDirective to handle all selection logic.
 * 
 * Features:
 * - Displays 4-6 weeks dynamically
 * - Shows padding days from previous/next months
 * - Supports mouse-based date range selection
 * - Expandable week rows via toggle buttons
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
  imports: [Selection, SelectableDirective, MonthWeek, ResizeObserverDirective, IconButtonComponent, IconComponent],
  templateUrl: './month-grid.html',
  styleUrl: './month-grid.scss',
})
export class MonthGrid implements Selectable {
  private readonly elementRef = inject(ElementRef)
  private readonly store = inject(CalendarStore)

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
    console.log('weeks cambiaron')
    return getMonthCalendarGrid(this.currentDate())
  })

  /**
   * Dynamic grid-template-rows based on actual number of weeks.
   * Uses minmax(0, auto) to allow expanded weeks to grow beyond equal distribution.
   */
  readonly gridTemplateRows = computed(() =>
    `repeat(${this.weeks().length}, minmax(0, auto))`
  )

  /**
   * Calculates which weeks have content that exceeds minimum height.
   * Returns a Map of weekIndex -> hasOverflow boolean.
   */
  readonly weekOverflowMap = computed(() => {
    const weeks = this.weeks()
    const events = this.store.currentViewEvents()
    const minHeight = this.store.minWeekRowHeight()
    const result = new Map<number, boolean>()

    weeks.forEach((week, index) => {
      const weekDays = week.days
      if (weekDays.length === 0) {
        result.set(index, false)
        return
      }

      const weekRange = {
        start: startOfDay(weekDays[0].date),
        end: endOfDay(weekDays[weekDays.length - 1].date)
      }

      const weekEvents = events.filter(e => isEventInRange(e, weekRange))

      if (weekEvents.length === 0) {
        result.set(index, false)
        return
      }

      const slots = sliceEventsByWeek(weekEvents, weekRange)
      const rowHeight = SLOT_HEIGHT + SLOT_GAP
      const maxRow = Math.max(...slots.map(slot => Math.floor(slot.position.top / rowHeight)))
      const rows = maxRow + 1
      const expandedHeight = CELL_HEADER_HEIGHT + (rows * SLOT_HEIGHT) + ((rows - 1) * SLOT_GAP) + SLOT_GAP

      result.set(index, expandedHeight > minHeight)
    })

    return result
  })

  /**
   * Checks if a week has overflowing content.
   * @param weekIndex - Index of the week to check
   * @returns true if the week has more events than can fit
   */
  hasOverflow(weekIndex: number): boolean {
    return this.weekOverflowMap().get(weekIndex) ?? false
  }

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

    return new Date(dateStr);
  }

  /**
   * Handles resize events from the first week container.
   * Stores the height in CalendarStore to be shared with all weeks.
   */
  onWeekResize(event: ResizeEvent): void {
    console.log('week resize', event)
    this.store.setWeekRowHeight(event.height)
  }

  /**
   * Toggles the expansion state of a week.
   * @param weekIndex - Index of the week to toggle (0-based)
   */
  onToggleWeek(weekIndex: number): void {
    this.store.toggleWeekExpansion(weekIndex)
  }

  /**
   * Checks if a week is currently expanded.
   * @param weekIndex - Index of the week to check
   * @returns true if the week is expanded
   */
  isWeekExpanded(weekIndex: number): boolean {
    return this.store.expandedWeekIndex() === weekIndex
  }
}
