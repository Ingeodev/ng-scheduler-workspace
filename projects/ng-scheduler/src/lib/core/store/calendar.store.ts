import { computed, Injectable, signal } from '@angular/core';
import { DEFAULT_CONFIG } from '../config/default-schedule-config';
import { SchedulerConfig, ViewMode } from '../models/config-schedule';

@Injectable()
export class CalendarStore {
  // State Signals
  readonly currentDate = signal<Date>(new Date());
  readonly viewMode = signal<ViewMode>('month');
  readonly config = signal<SchedulerConfig>(DEFAULT_CONFIG);

  // Computed Selectors
  readonly viewDate = computed(() => this.currentDate());
  readonly currentView = computed(() => this.viewMode());

  // Helpers
  readonly formattedDate = computed(() => {
    const date = this.currentDate();
    return new Intl.DateTimeFormat(this.config().locale, {
      month: 'long',
      year: 'numeric',
      day: this.viewMode() === 'day' ? 'numeric' : undefined
    }).format(date);
  });

  constructor() {
    // Initialize with default config if needed, or handle partial updates
  }

  // Actions
  setDate(date: Date) {
    this.currentDate.set(date);
  }

  changeView(view: ViewMode) {
    this.viewMode.set(view);
  }

  updateConfig(config: Partial<SchedulerConfig>) {
    this.config.update(current => ({ ...current, ...config }));

    // Side effects from config update
    if (config.initialDate) {
      this.setDate(new Date(config.initialDate));
    }
    if (config.initialView) {
      this.changeView(config.initialView);
    }
  }

  next() {
    const mode = this.viewMode();
    const current = new Date(this.currentDate());

    switch (mode) {
      case 'day':
      case 'resource':
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() + 1);
        break;
    }
    this.setDate(current);
  }

  prev() {
    const mode = this.viewMode();
    const current = new Date(this.currentDate());

    switch (mode) {
      case 'day':
      case 'resource':
        current.setDate(current.getDate() - 1);
        break;
      case 'week':
        current.setDate(current.getDate() - 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() - 1);
        break;
    }
    this.setDate(current);
  }

  today() {
    this.setDate(new Date());
  }
}
