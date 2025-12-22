import { Component, effect, input, inject, ViewEncapsulation, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';
import { SchedulerConfig, ViewMode } from '../../../core/models/config-schedule';
import { SelectionResult } from '../../../core/background-selection/selectable/selectable.directive';
import { AnyEvent } from '../../../core/models/event';
import { ResourceModel } from '../../../core/models/event-model';
import { ResourceView } from '../../resource/resource-view/resource-view';
import { IconComponent } from '../../../shared/components/icon/icon';
import { HeaderSchedule } from '../header-schedule/header-schedule';
import { MonthView } from '../../month/month-view/month-view';
import { WeekView } from '../../week/week-view/week-view';
import { SidebarSchedule } from '../sidebar-schedule/sidebar-schedule';

@Component({
  selector: 'mglon-schedule',
  standalone: true,
  imports: [CommonModule, ResourceView, MonthView, HeaderSchedule, SidebarSchedule, WeekView],
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

  /** Emitted when a resource is shown/activated */
  readonly resourceShow = output<string>();

  /** Emitted when a resource is hidden/deactivated */
  readonly resourceHide = output<string>();

  /** Emitted when an event is clicked in any view */
  readonly eventClick = output<AnyEvent>();

  readonly store = inject(CalendarStore);
  private readonly eventStore = inject(EventStore);

  constructor() {
    // Register global handlers
    // this.eventStore.setGlobalHandlers({
    //   eventClick: this.eventClick
    // });

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

    // Sync resources from EventStore (declarative) to CalendarStore
    effect(() => {
      const declarativeResources = this.eventStore.allResources();

      // Convert Resource to ResourceModel with isActive property
      const resourceModels: ResourceModel[] = declarativeResources.map(resource => ({
        ...resource,
        isActive: resource.isActive ?? true // Default to active if not specified
      }));

      // Only update if resources have changed
      if (resourceModels.length > 0) {
        this.store.setResources(resourceModels);
      }
    });

    // Emit resource show/hide events when resources change
    effect(() => {
      const resources = this.store.resources();

      resources.forEach(resource => {
        // Check previous state vs current state
        const wasActive = this.previousResourceStates.get(resource.id);
        const isActive = resource.isActive !== false;

        if (wasActive !== undefined && wasActive !== isActive) {
          if (isActive) {
            this.resourceShow.emit(resource.id);
          } else {
            this.resourceHide.emit(resource.id);
          }
        }

        // Update previous state
        this.previousResourceStates.set(resource.id, isActive);
      });
    });
  }

  private previousResourceStates = new Map<string, boolean>();

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
