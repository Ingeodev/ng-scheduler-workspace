import { Component, inject, viewChild, ElementRef, afterNextRender, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthHeader } from '../month-header/month-header';
import { MonthGrid } from '../month-grid/month-grid';
import { CalendarStore } from '../../../core/store/calendar.store';
import { MONTH_VIEW_LAYOUT } from '../../../core/config/month-view.config';

@Component({
  selector: 'mglon-month-view',
  standalone: true,
  imports: [CommonModule, MonthHeader, MonthGrid],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView {
  readonly calendarStore = inject(CalendarStore);

  // Get month grid element reference
  readonly gridElement = viewChild<ElementRef<HTMLElement>>('gridRef');

  constructor() {
    // Set up grid synchronization after view init
    afterNextRender(() => {
      // Logic for grid sizing can remain if needed for the grid itself
    });
  }
}

