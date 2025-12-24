import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DEFAULT_CONFIG } from '../config/default-schedule-config';
import { SchedulerConfig, ViewMode } from '../models/config-schedule';
import { UIConfig, DEFAULT_UI_CONFIG, HeaderUIConfig, SidebarUIConfig, GridUIConfig } from '../models/ui-config';
import { ResourceModel } from '../models/resource.model';
import { AnyEvent } from '../models/event.model';
import { getViewRange, isEventInRange } from '../../shared/helpers/calendar.helpers';

interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  config: SchedulerConfig;
  uiConfig: UIConfig;

  /**
   * Map of events, where the key is the event ID and the value is the event object.
   * This is used to store and access events by their ID.
   */
  events: Map<string, AnyEvent>;

  /**
   * Map of resources, where the key is the resource ID and the value is the resource object.
   * This is used to store and access resources by their ID.
   */
  resources: Map<string, ResourceModel>;
}

const initialCalendarState: CalendarState = {
  currentDate: new Date(),
  viewMode: 'month',
  config: DEFAULT_CONFIG,
  uiConfig: DEFAULT_UI_CONFIG,

  events: new Map<string, AnyEvent>(),
  resources: new Map<string, ResourceModel>(),
};

export const CalendarStore = signalStore(
  { providedIn: 'root' },
  withState(initialCalendarState),
  withComputed(({ resources, events, currentDate, viewMode, config }) => ({
    // Date & View Computeds
    viewDate: computed(() => currentDate()),
    currentView: computed(() => viewMode()),
    viewRange: computed(() => getViewRange(currentDate(), viewMode())),
    formattedDate: computed(() => {
      const date = currentDate();
      return new Intl.DateTimeFormat(config().locale, {
        month: 'long',
        year: 'numeric',
        day: viewMode() === 'day' ? 'numeric' : undefined
      }).format(date);
    }),

    // Resource Computeds
    allResources: computed(() => Array.from(resources().values())),
    resourceCount: computed(() => resources().size),
    activeResources: computed(() =>
      Array.from(resources().values()).filter(r => r.isActive !== false)
    ),
    inactiveResources: computed(() =>
      Array.from(resources().values()).filter(r => r.isActive === false)
    ),

    // Event Computeds
    allEvents: computed(() => Array.from(events().values())),
    eventCount: computed(() => events().size),
    currentViewEvents: computed(() => {
      const range = getViewRange(currentDate(), viewMode());
      return Array.from(events().values()).filter(event => isEventInRange(event, range));
    })
  })),
  withMethods((store) => ({
    // --- Navigation & View Methods ---
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

      if (config.resources) {
        this.registerResources(config.resources);
      }
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
    },

    // --- Resource Methods ---
    registerResources(resources: ResourceModel[]) {
      patchState(store, (state) => {
        const newMap = new Map(state.resources);
        resources.forEach(r => newMap.set(r.id, r));
        return { resources: newMap };
      });
    },
    registerResource(resource: ResourceModel) {
      patchState(store, (state) => {
        const newMap = new Map(state.resources);
        newMap.set(resource.id, resource);
        return { resources: newMap };
      });
    },
    updateResource(id: string, partial: Partial<ResourceModel>) {
      patchState(store, (state) => {
        const resource = state.resources.get(id);
        if (!resource) return state;
        const newMap = new Map(state.resources);
        newMap.set(id, { ...resource, ...partial });
        return { resources: newMap };
      });
    },
    unregisterResource(id: string) {
      patchState(store, (state) => {
        const newMap = new Map(state.resources);
        newMap.delete(id);
        return { resources: newMap };
      });
    },
    getResource(id: string): ResourceModel | undefined {
      return store.resources().get(id);
    },
    toggleResource(id: string) {
      const resource = store.resources().get(id);
      if (resource) {
        this.updateResource(id, { isActive: resource.isActive === false });
      }
    },
    showResource(id: string) {
      this.updateResource(id, { isActive: true });
    },
    hideResource(id: string) {
      this.updateResource(id, { isActive: false });
    },

    // --- Event Methods ---
    setEvents(events: AnyEvent[]) {
      const eventsMap = new Map<string, AnyEvent>();
      events.forEach(e => eventsMap.set(e.id, e));
      patchState(store, { events: eventsMap });
    },
    registerEvent(event: AnyEvent) {
      patchState(store, (state) => {
        const newMap = new Map(state.events);
        newMap.set(event.id, event);
        return { events: newMap };
      });
    },
    updateEvent(id: string, partial: Partial<AnyEvent>) {
      patchState(store, (state) => {
        const event = state.events.get(id);
        if (!event) return state;
        const newMap = new Map(state.events);
        newMap.set(id, { ...event, ...partial } as AnyEvent);
        return { events: newMap };
      });
    },
    unregisterEvent(id: string) {
      patchState(store, (state) => {
        const newMap = new Map(state.events);
        newMap.delete(id);
        return { events: newMap };
      });
    },
    getEvent(id: string): AnyEvent | undefined {
      return store.events().get(id);
    },
    getEventsByResource(resourceId: string): AnyEvent[] {
      return Array.from(store.events().values()).filter(event => event.resourceId === resourceId);
    },

    clear(): void {
      patchState(store, {
        events: new Map(),
        resources: new Map(),
      });
    },

    setUIConfig(config: {
      header?: Partial<HeaderUIConfig>;
      sidebar?: Partial<SidebarUIConfig>;
      grid?: Partial<GridUIConfig>;
    }) {
      patchState(store, (state) => ({
        uiConfig: {
          header: config.header
            ? {
              buttonGroup: config.header.buttonGroup
                ? { ...state.uiConfig.header.buttonGroup, ...config.header.buttonGroup }
                : state.uiConfig.header.buttonGroup,
              iconButtons: config.header.iconButtons
                ? { ...state.uiConfig.header.iconButtons, ...config.header.iconButtons }
                : state.uiConfig.header.iconButtons,
              todayButton: config.header.todayButton
                ? { ...state.uiConfig.header.todayButton, ...config.header.todayButton }
                : state.uiConfig.header.todayButton
            }
            : state.uiConfig.header,
          sidebar: config.sidebar
            ? {
              resourceItems: config.sidebar.resourceItems
                ? { ...state.uiConfig.sidebar.resourceItems, ...config.sidebar.resourceItems }
                : state.uiConfig.sidebar.resourceItems
            }
            : state.uiConfig.sidebar,
          grid: state.uiConfig.grid
        }
      }));
    }
  }))
);
