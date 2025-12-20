import { Component, input, computed, viewChild, ElementRef, inject } from '@angular/core';
import { getWeekTimeSlots, getWeekDays, TimeSlot, WeekDay } from '../../../shared/helpers';
import { TimeSlotComponent } from '../time-slot/time-slot';
import { Selection } from '../../../shared/components/selection/selection';
import { Selectable, SelectableDirective, SelectionResult } from '../../../shared/dirrectives/select';

/**
 * Week grid component displaying time slots for 7 days.
 * 
 * Implements the Selectable interface to enable time-based selection.
 * Displays a scrollable grid of 30-minute time slots (48 per day).
 * 
 * Features:
 * - 7 columns (days) × 48 rows (time slots)
 * - Scrollable container
 * - Mouse-based time selection
 * - 50px minimum height per slot
 * 
 * @example
 * ```html
 * <mglon-week-grid 
 *   [currentDate]="selectedDate"
 *   (selectionEnd)="onTimeRangeSelected($event)">
 * </mglon-week-grid>
 * ```
 */
@Component({
  selector: 'mglon-week-grid',
  standalone: true,
  imports: [TimeSlotComponent, Selection, SelectableDirective],
  templateUrl: './week-grid.html',
  styleUrl: './week-grid.scss',
})
export class WeekGrid implements Selectable {
  private readonly elementRef = inject(ElementRef);

  /**
   * Reference to the SelectableDirective instance
   */
  readonly selectableDirective = viewChild(SelectableDirective);

  /**
   * The date to display the week for
   */
  readonly currentDate = input<Date>(new Date());

  /**
   * Computed 2D array of time slots [days][slots]
   */
  readonly timeSlots = computed<TimeSlot[][]>(() => {
    return getWeekTimeSlots(this.currentDate());
  });

  /**
   * Computed array of week days for column headers
   */
  readonly weekDays = computed<WeekDay[]>(() => {
    return getWeekDays(this.currentDate());
  });

  /**
   * Computed index of today's column (-1 if today is not in this week)
   */
  readonly todayColumnIndex = computed<number>(() => {
    const days = this.weekDays();
    return days.findIndex(day => day.isToday);
  });

  /**
   * Slot height in pixels (matches CSS min-height)
   */
  private readonly SLOT_HEIGHT = 50;

  /**
   * Time column width in pixels (matches CSS grid-template-columns)
   */
  private readonly TIME_COLUMN_WIDTH = 60;

  /**
   * Calculates the left position for the today indicator line
   * @returns Position in pixels from the left edge
   */
  getTodayIndicatorPosition(): number {
    const index = this.todayColumnIndex();
    if (index === -1) return 0;

    const gridElement = this.elementRef.nativeElement as HTMLElement;
    if (!gridElement) return 0;

    const gridRect = gridElement.getBoundingClientRect();
    const dayColumnWidth = (gridRect.width - this.TIME_COLUMN_WIDTH - 8) / 7; // -8 for scrollbar

    // Position at the center of the column
    return this.TIME_COLUMN_WIDTH + (dayColumnWidth * index) + (dayColumnWidth / 2);
  }

  /**
   * Implements Selectable.getDateFromPoint()
   * 
   * Translates visual coordinates into a specific date and time.
   * 
   * Algorithm:
   * 1. Convert relative coordinates to absolute
   * 2. Determine which day column (0-6)
   * 3. Determine which time slot row (0-47)
   * 4. Calculate exact time (hour + minute)
   * 5. Return Date object with specific date and time
   * 
   * @param x - X coordinate relative to the grid container
   * @param y - Y coordinate relative to the grid container
   * @returns Object with date property (including time), or null if invalid
   */
  getDateFromPoint(x: number, y: number): { date: Date } | null {
    const gridElement = this.elementRef.nativeElement as HTMLElement;
    if (!gridElement) return null;

    // Account for time column
    const adjustedX = x - this.TIME_COLUMN_WIDTH;
    if (adjustedX < 0) return null; // Clicked on time column

    // Calculate which day column (0-6)
    const gridRect = gridElement.getBoundingClientRect();
    const dayColumnWidth = (gridRect.width - this.TIME_COLUMN_WIDTH) / 7;
    const dayIndex = Math.floor(adjustedX / dayColumnWidth);

    if (dayIndex < 0 || dayIndex > 6) return null;

    // Calculate which time slot (0-47)
    const slotIndex = Math.floor(y / this.SLOT_HEIGHT);
    if (slotIndex < 0 || slotIndex > 47) return null;

    // Get the time slot
    const timeSlots = this.timeSlots();
    if (!timeSlots[dayIndex] || !timeSlots[dayIndex][slotIndex]) return null;

    return { date: timeSlots[dayIndex][slotIndex].date };
  }

  /**
   * Handles selection start event
   */
  onSelectionStart(result: SelectionResult): void {
    console.log('Week selection started:', result);
  }

  /**
   * Handles selection change event
   */
  onSelectionChange(result: SelectionResult): void {
    console.log('Week selection changed:', result);
  }

  /**
   * Handles selection end event
   */
  onSelectionEnd(result: SelectionResult): void {
    console.log('Week selection ended:', result);
  }
}
