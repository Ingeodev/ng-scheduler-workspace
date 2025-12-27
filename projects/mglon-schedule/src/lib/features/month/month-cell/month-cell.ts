import { Component, computed, inject, input } from '@angular/core';
import { CalendarDay } from '../../../shared/helpers';
import { MonthDayIndicator } from "../month-day-indicator/month-day-indicator";
import { CalendarStore } from '../../../core/store/calendar.store';

@Component({
  selector: 'mglon-month-cell',
  standalone: true,
  imports: [MonthDayIndicator],
  templateUrl: './month-cell.html',
  styleUrl: './month-cell.scss',
})
export class MonthCell {
  private readonly store = inject(CalendarStore);

  // Input for the day data
  readonly day = input.required<CalendarDay>();

  /** Whether a slot is currently being dragged or resized over this cell */
  readonly isDragOver = computed(() => {
    const dragState = this.store.dragState();
    const resizeState = this.store.resizeState();

    const hoverDate = dragState.hoverDate || resizeState.hoverDate;
    if (!hoverDate) return false;

    return hoverDate.getTime() === this.day().date.getTime();
  });
}
