import { Component, inject } from '@angular/core';
import { WeekHeader } from '../week-header/week-header';
import { WeekGrid } from '../week-grid/week-grid';
import { CalendarStore } from '../../../core/store/calendar.store';

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
 * <mglon-week-view></mglon-week-view>
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
   * Calendar store for accessing current date and navigation
   */
  readonly store = inject(CalendarStore);
}
