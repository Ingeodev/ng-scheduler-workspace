import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DEFAULT_CONFIG } from '../config/default-schedule-config';
import { SchedulerConfig, ViewMode } from '../models/config-schedule';
import { UIConfig, DEFAULT_UI_CONFIG, HeaderUIConfig, SidebarUIConfig, GridUIConfig } from '../models/ui-config';
import { ResourceModel } from '../models/resource.model';
import { AnyEvent } from '../models/event.model';
import { getViewRange } from '../../shared/helpers/calendar.helpers';

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
    resourcesArray: computed(() => Array.from(resources().values())),
    resourcesCount: computed(() => resources().size),
    activeResources: computed(() =>
      Array.from(resources().values()).filter(r => r.isActive !== false)
    ),
    inactiveResources: computed(() =>
      Array.from(resources().values()).filter(r => r.isActive === false)
    ),

    // Event Computeds
    eventsArray: computed(() => Array.from(events().values())),
    eventsCount: computed(() => events().size)
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
        this.setResources(config.resources);
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
    setResources(resources: ResourceModel[]) {
      const resourcesMap = new Map<string, ResourceModel>();
      resources.forEach(r => resourcesMap.set(r.id, r));
      patchState(store, { resources: resourcesMap });
    },
    addResource(resource: ResourceModel) {
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
    toggleResource(id: string) {
      const resource = store.resources().get(id);
      if (resource) {
        this.updateResource(id, { isActive: resource.isActive === false });
      }
    },
    activateResource(id: string) {
      this.updateResource(id, { isActive: true });
    },
    deactivateResource(id: string) {
      this.updateResource(id, { isActive: false });
    },

    // --- Event Methods ---
    setEvents(events: AnyEvent[]) {
      const eventsMap = new Map<string, AnyEvent>();
      events.forEach(e => eventsMap.set(e.id, e));
      patchState(store, { events: eventsMap });
    },
    addEvent(event: AnyEvent) {
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
    removeEvent(id: string) {
      patchState(store, (state) => {
        const newMap = new Map(state.events);
        newMap.delete(id);
        return { events: newMap };
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
