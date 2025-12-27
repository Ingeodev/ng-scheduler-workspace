import { Component, inject, computed } from '@angular/core';
import { ResourceListSchedule } from '../resource-list-schedule/resource-list-schedule';
import { CalendarStore } from '../../../core/store/calendar.store';

@Component({
  selector: 'mglon-sidebar-schedule',
  standalone: true,
  imports: [ResourceListSchedule],
  templateUrl: './sidebar-schedule.html',
  styleUrl: './sidebar-schedule.scss',
  host: {
    '[style.--mglon-sidebar-radius]': 'borderRadius() === "none" ? "0" : "var(--mglon-schedule-radius-" + borderRadius() + ")"',
    '[style.--mglon-sidebar-bg]': 'backgroundColor()',
    '[attr.data-radius]': 'borderRadius()'
  }
})
export class SidebarSchedule {
  readonly store = inject(CalendarStore);

  readonly backgroundColor = computed(() => this.store.uiConfig().sidebar.background);
  readonly borderRadius = computed(() => this.store.uiConfig().sidebar.rounded || 'none');

  onToggleResource(id: string) {
    this.store.toggleResource(id);
  }
}

