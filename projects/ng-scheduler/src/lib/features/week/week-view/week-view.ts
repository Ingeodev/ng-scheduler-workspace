import { Component, inject, computed, viewChild, ElementRef, afterNextRender, output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeekHeader } from '../week-header/week-header';
import { WeekGrid } from '../week-grid/week-grid';
import { CalendarStore } from '../../../core/store/calendar.store';
import { SelectionResult } from '../../../core/background-selection/selectable/selectable.directive';

/**
 * Week view container component.
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
  readonly store = inject(CalendarStore);

  // ============================================
  // OUTPUT EVENTS
  // ============================================

  /** Emitted when selection starts */
  readonly selectionStart = output<SelectionResult>();

  /** Emitted while selecting */
  readonly selectionChange = output<SelectionResult>();

  /** Emitted when selection ends */
  readonly selectionEnd = output<SelectionResult>();

  // Get week grid element reference
  readonly gridElement = viewChild(WeekGrid, { read: ElementRef });

  readonly animationState = computed(() => {
    const date = this.store.currentDate();
    return this.getWeekNumber(date);
  });

  constructor() {
    afterNextRender(() => {
      // Logic for grid sizing can remain if needed for the grid itself, 
      // but let's see if we can simplify it.
    });
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

