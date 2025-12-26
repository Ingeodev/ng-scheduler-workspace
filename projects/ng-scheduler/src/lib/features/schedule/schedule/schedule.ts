import { Component, effect, input, inject, ViewEncapsulation, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarStore } from '../../../core/store/calendar.store';
import { SchedulerConfig, ViewMode } from '../../../core/models/config-schedule';
import { SelectionResult } from '../../../core/background-selection/selectable/selectable.directive';
import { ResourceModel } from '../../../core/models/resource.model';
import {
  HeaderUIConfig,
  SidebarUIConfig,
  GridUIConfig,
  UIConfig
} from '../../../core/models/ui-config';
import { ResourceView } from '../../resource/resource-view/resource-view';
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

  // ============================================
  // UI CONFIGURATION INPUTS (Area-Based)
  // ============================================

  /** Optional UI configuration for header area (button-group, navigation, today button) */
  readonly headerUI = input<Partial<HeaderUIConfig>>();

  /** Optional UI configuration for sidebar area (resource items) */
  readonly sidebarUI = input<Partial<SidebarUIConfig>>();

  /** Optional UI configuration for grid area (event slots, overflow indicators) */
  readonly gridUI = input<Partial<GridUIConfig>>();

  /** Optional default color for all events in the schedule */
  readonly color = input<string>();

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

  /** Emitted when a resource is shown/activated */
  readonly resourceShow = output<string>();

  /** Emitted when a resource is hidden/deactivated */
  readonly resourceHide = output<string>();

  readonly store = inject(CalendarStore);


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

    // Handle UI configuration updates (area-based)
    effect(() => {
      const headerConfig = this.headerUI();
      const sidebarConfig = this.sidebarUI();
      const gridConfig = this.gridUI();
      const primaryColor = this.color();

      // Only update if at least one config is provided
      if (headerConfig || sidebarConfig || gridConfig || primaryColor) {
        // Construct a safe partial grid config
        const finalGridConfig: Partial<GridUIConfig> = gridConfig ? { ...gridConfig } : {};

        if (primaryColor) {
          finalGridConfig.eventSlots = {
            ...finalGridConfig.eventSlots,
            color: finalGridConfig.eventSlots?.color || primaryColor
          } as any; // Cast to any to bypass the mandatory 'rounded' check in this partial context
        }

        this.store.setUIConfig({
          header: headerConfig,
          sidebar: sidebarConfig,
          grid: finalGridConfig
        });
      }
    });

    // Emit viewChange when view mode changes
    effect(() => {
      const view = this.store.viewMode();
      this.viewChange.emit(view);
    });



    // Emit resource show/hide events when resources change
    effect(() => {
      const resources = this.store.allResources();

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
