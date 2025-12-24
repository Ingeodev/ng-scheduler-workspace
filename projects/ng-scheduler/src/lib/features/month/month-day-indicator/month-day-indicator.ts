import { Component, input } from '@angular/core';
import { CalendarDay } from "../../../shared/helpers";

@Component({
  selector: 'mglon-month-day-indicator',
  imports: [],
  templateUrl: './month-day-indicator.html',
  styleUrl: './month-day-indicator.scss',
})
export class MonthDayIndicator {
  readonly day = input.required<CalendarDay>();
}
