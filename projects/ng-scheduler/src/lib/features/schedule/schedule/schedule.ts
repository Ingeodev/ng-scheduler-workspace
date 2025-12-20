import { Component, effect, input, inject, ViewEncapsulation, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarStore } from '../../../core/store/calendar.store';
import { SchedulerConfig, ViewMode } from '../../../core/models/config-schedule';
import { SelectionResult } from '../../../core/background-selection/selectable/selectable.directive';
import { AnyEvent } from '../../../core/models/event';
import { ResourceView } from '../../resource/resource-view/resource-view';
import { IconComponent } from '../../../shared/components/icon/icon';
import { HeaderSchedule } from '../header-schedule/header-schedule';
import { MonthView } from '../../month/month-view/month-view';
import { WeekView } from '../../week/week-view/week-view';

@Component({
  selector: 'mglon-schedule',
  standalone: true,
  imports: [CommonModule, ResourceView, MonthView, HeaderSchedule, WeekView],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  providers: [CalendarStore],
  encapsulation: ViewEncapsulation.None
})
export class Schedule {
  readonly config = input<Partial<SchedulerConfig>>({});
  readonly add = output<void>();

  // ============================================
  // OUTPUT EVENTS
  // ============================================

  /** Emitted when selection starts (mousedown) */
  readonly selectionStart = output<SelectionResult>();

  /** Emitted while selecting (mousemove) */
  readonly selectionChange = output<SelectionResult>();

  /** Emitted when selection ends (mouseup) */
  readonly selectionEnd = output<SelectionResult>();

  /** Emitted when view mode changes */
  readonly viewChange = output<ViewMode>();

  /** Emitted when displayed date range changes */
  readonly dateRangeChange = output<{ start: Date; end: Date }>();

  /** Emitted when events have been rendered */
  readonly eventsRendered = output<AnyEvent[]>();

  readonly store = inject(CalendarStore);

  constructor() {
    effect(() => {
      const conf = this.config();
      if (conf) {
        this.store.updateConfig(conf);
      }
    });

    // Emit viewChange when view mode changes
    effect(() => {
      const view = this.store.viewMode();
      this.viewChange.emit(view);
    });
  }

  get api() {
    return {
      next: () => this.store.next(),
      prev: () => this.store.prev(),
      today: () => this.store.today(),
      changeView: (view: ViewMode) => this.store.changeView(view),
      setDate: (date: Date) => this.store.setDate(date)
    };
  }
}
