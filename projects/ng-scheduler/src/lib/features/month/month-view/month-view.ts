import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthHeader } from '../month-header/month-header';
import { MonthGrid } from '../month-grid/month-grid';
import { CalendarStore } from '../../../core/store/calendar.store';

@Component({
  selector: 'mglon-month-view',
  standalone: true,
  imports: [CommonModule, MonthHeader, MonthGrid],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView {
  readonly store = inject(CalendarStore);

}
