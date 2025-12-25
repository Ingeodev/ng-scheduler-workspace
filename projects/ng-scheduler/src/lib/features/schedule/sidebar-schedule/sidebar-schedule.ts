import { Component, inject } from '@angular/core';
import { ResourceListSchedule } from '../resource-list-schedule/resource-list-schedule';
import { CalendarStore } from '../../../core/store/calendar.store';

@Component({
  selector: 'mglon-sidebar-schedule',
  standalone: true,
  imports: [ResourceListSchedule],
  templateUrl: './sidebar-schedule.html',
  styleUrl: './sidebar-schedule.scss',
})
export class SidebarSchedule {
  readonly store = inject(CalendarStore);

  onToggleResource(id: string) {
    this.store.toggleResource(id);
  }
}

