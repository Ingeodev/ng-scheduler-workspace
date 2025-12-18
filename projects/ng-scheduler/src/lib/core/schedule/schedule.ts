import { Component, effect, input, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarStore } from '../store/calendar.store';
import { SchedulerConfig, ViewMode } from '../models/config-schedule';
import { ResourceView } from '../../features/resource/resource-view/resource-view';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'mglon-schedule',
  standalone: true,
  imports: [CommonModule, ResourceView, IconComponent],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  providers: [CalendarStore],
  encapsulation: ViewEncapsulation.None
})
export class Schedule {
  readonly config = input<Partial<SchedulerConfig>>({});

  readonly store = inject(CalendarStore);

  constructor() {
    effect(() => {
      const conf = this.config();
      if (conf) {
        this.store.updateConfig(conf);
      }
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
