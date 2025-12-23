import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarStore } from '../../../core/store/calendar.store';
import { ResourceModel } from '../../../core/models/event-model';
import { ResourceItemSchedule } from '../resource-item-schedule/resource-item-schedule';

@Component({
  selector: 'mglon-resource-list-schedule',
  standalone: true,
  imports: [CommonModule, ResourceItemSchedule],
  templateUrl: './resource-list-schedule.html',
  styleUrl: './resource-list-schedule.scss',
})
export class ResourceListSchedule {
  private calendarStore = inject(CalendarStore);

  // Sidebar UI Configuration from Store
  readonly resourceItemRounded = computed(() => this.calendarStore.uiConfig().sidebar.resourceItems.rounded);
  readonly resourceItemDensity = computed(() => this.calendarStore.uiConfig().sidebar.resourceItems.density);

  /** Array of resources to display */
  readonly resources = input<ResourceModel[]>([]);

  /** Emitted when a resource is toggled */
  readonly toggleResource = output<string>();
}
