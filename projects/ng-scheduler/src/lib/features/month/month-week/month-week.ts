import { Component, input, viewChild } from '@angular/core';
import { CalendarWeek } from '../../../shared/helpers';
import { MonthCell } from '../month-cell/month-cell';
import { CELL_HEADER_HEIGHT } from '../../../core/config/default-schedule-config';

@Component({
  selector: 'mglon-month-week',
  imports: [MonthCell],
  templateUrl: './month-week.html',
  styleUrl: './month-week.scss',
})
export class MonthWeek {
  readonly week = input.required<CalendarWeek>();

  private weekEventsContainer = viewChild('weekEventsContainer')

  readonly top = CELL_HEADER_HEIGHT;

}
