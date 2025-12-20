import { Component, input } from '@angular/core';
import { WeekHeader } from '../week-header/week-header';
import { WeekGrid } from '../week-grid/week-grid';

/**
 * Week view container component.
 * 
 * Displays a weekly calendar with time slots in 30-minute intervals.
 * Combines a sticky header showing days and a scrollable grid of time slots.
 * 
 * Features:
 * - 7-day week view (Sunday to Saturday)
 * - 30-minute time slot intervals
 * - Sticky header with day names/numbers
 * - Scrollable time grid
 * - Mouse-based time selection
 * 
 * @example
 * ```html
 * <mglon-week-view [currentDate]="selectedDate"></mglon-week-view>
 * ```
 */
@Component({
  selector: 'mglon-week-view',
  standalone: true,
  imports: [WeekHeader, WeekGrid],
  templateUrl: './week-view.html',
  styleUrl: './week-view.scss',
})
export class WeekView {
  /**
   * The date to display the week for.
   * Can be any date within the target week.
   * @default new Date() (current week)
   */
  readonly currentDate = input<Date>(new Date());
}
