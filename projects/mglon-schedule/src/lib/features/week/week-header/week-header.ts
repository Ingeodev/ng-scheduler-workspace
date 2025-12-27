import { Component, input, computed } from '@angular/core';
import { getWeekDays, WeekDay } from '../../../shared/helpers';

/**
 * Header component for the week view displaying the 7 days of the week.
 * 
 * Shows day names and numbers in a sticky header that remains visible
 * when scrolling through time slots.
 * 
 * Features:
 * - Sticky positioning
 * - Highlights today
 * - Shows day name (Sun, Mon, etc.) and day number
 * 
 * @example
 * ```html
 * <mglon-week-header [currentDate]="selectedDate"></mglon-week-header>
 * ```
 */
@Component({
  selector: 'mglon-week-header',
  standalone: true,
  imports: [],
  templateUrl: './week-header.html',
  styleUrl: './week-header.scss',
})
export class WeekHeader {
  /**
   * The date to display the week for.
   * Can be any date within the target week.
   */
  readonly currentDate = input<Date>(new Date());

  /**
   * Computed array of the 7 days in the week
   */
  readonly weekDays = computed<WeekDay[]>(() => {
    return getWeekDays(this.currentDate());
  });
}
