import { Component, inject, computed } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
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
 * - Smooth slide animation on week navigation
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
  animations: [
    trigger('weekTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX({{ direction }}%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { params: { direction: 0 } })
    ])
  ]
})
export class WeekView {
  /**
   * Calendar store for accessing current date and navigation
   */
  readonly store = inject(CalendarStore);

  /**
   * Animation state based on current date
   */
  readonly animationState = computed(() => {
    const date = this.store.currentDate();
    return this.getWeekNumber(date);
  });

  /**
   * Calculates week number for a given date
   */
  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
