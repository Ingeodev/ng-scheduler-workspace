import { Component, inject } from '@angular/core';
import { ResourceListSchedule } from '../resource-list-schedule/resource-list-schedule';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';

@Component({
  selector: 'mglon-sidebar-schedule',
  standalone: true,
  imports: [ResourceListSchedule],
  templateUrl: './sidebar-schedule.html',
  styleUrl: './sidebar-schedule.scss',
})
export class SidebarSchedule {
  readonly store = inject(CalendarStore);
  private readonly eventStore = inject(EventStore);

  onToggleResource(id: string) {
    // Use EventStore as single source of truth
    const resource = this.eventStore.getResource(id);

    if (resource) {
      if (resource.isActive !== false) {
        this.eventStore.hideResource(id);
      } else {
        this.eventStore.showResource(id);
      }
    }
  }
}
