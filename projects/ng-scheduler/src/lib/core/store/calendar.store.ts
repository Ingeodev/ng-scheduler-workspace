import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DEFAULT_CONFIG } from '../config/default-schedule-config';
import { SchedulerConfig, ViewMode } from '../models/config-schedule';
import { EventModel, ResourceModel } from '../models/event-model';

interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  config: SchedulerConfig;
  events: EventModel[];
  resources: ResourceModel[];
}

const initialState: CalendarState = {
  currentDate: new Date(),
  viewMode: 'month',
  config: DEFAULT_CONFIG,
  events: [],
  resources: []
};

export const CalendarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ currentDate, viewMode, config }) => ({
    viewDate: computed(() => currentDate()),
    currentView: computed(() => viewMode()),
    formattedDate: computed(() => {
      const date = currentDate();
      return new Intl.DateTimeFormat(config().locale, {
        month: 'long',
        year: 'numeric',
        day: viewMode() === 'day' ? 'numeric' : undefined
      }).format(date);
    })
  })),
  withMethods((store) => ({
    setDate(date: Date) {
      patchState(store, { currentDate: date });
    },
    changeView(view: ViewMode) {
      patchState(store, { viewMode: view });
    },
    updateConfig(config: Partial<SchedulerConfig>) {
      patchState(store, (state) => ({
        config: { ...state.config, ...config },
        currentDate: config.initialDate ? new Date(config.initialDate) : state.currentDate,
        viewMode: config.initialView || state.viewMode
      }));
    },
    setEvents(events: EventModel[]) {
      patchState(store, { events });
    },
    setResources(resources: ResourceModel[]) {
      patchState(store, { resources });
    },
    next() {
      const mode = store.viewMode();
      const current = new Date(store.currentDate());

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
      patchState(store, { currentDate: current });
    },
    prev() {
      const mode = store.viewMode();
      const current = new Date(store.currentDate());

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
      patchState(store, { currentDate: current });
    },
    today() {
      patchState(store, { currentDate: new Date() });
    }
  }))
);
