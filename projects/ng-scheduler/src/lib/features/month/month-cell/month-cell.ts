import { Component, input } from '@angular/core';
import { CalendarDay } from '../../../shared/helpers';

@Component({
  selector: 'mglon-month-cell',
  standalone: true,
  imports: [],
  templateUrl: './month-cell.html',
  styleUrl: './month-cell.scss',
})
export class MonthCell {
  // Input for the day data
  readonly day = input.required<CalendarDay>();
}
