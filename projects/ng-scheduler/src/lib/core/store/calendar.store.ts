import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import {
  DEFAULT_CONFIG,
  CELL_HEADER_HEIGHT,
  SLOT_HEIGHT,
  SLOT_GAP,
  DEFAULT_VISIBLE_EVENT_ROWS
} from '../config/default-schedule-config'
import { SchedulerConfig, ViewMode } from '../models/config-schedule'
import { UIConfig, DEFAULT_UI_CONFIG, HeaderUIConfig, SidebarUIConfig, GridUIConfig } from '../models/ui-config'
import { ResizeSide } from '../../shared/directives/resizable.directive'
import { ResourceModel } from '../models/resource.model'
import { AnyEvent } from '../models/event.model'
import { getViewRange, isEventInRange } from '../../shared/helpers/calendar.helpers'
import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns'
import { Subject } from 'rxjs'
import { InteractionEvent, InteractionType } from '../models/interaction.model'

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

  /**
   * Height of a week row container in pixels.
   * Used to calculate how many event slots can fit in a week row.
   */
  weekRowHeight: number

  /**
   * Index of the currently expanded week (0-5), or null if no week is expanded.
   * Only one week can be expanded at a time.
   */
  expandedWeekIndex: number | null;

  /**
   * Current drag and drop state
   */
  dragState: {
    eventId: string | null;
    grabDate: Date | null;
    hoverDate: Date | null;
  };

  /**
   * Current resize state
   */
  resizeState: {
    eventId: string | null;
    side: ResizeSide | null;
    hoverDate: Date | null;
  };

  /**
   * Current active interaction to prevent conflicts (mutex)
   */
  interactionMode: 'none' | 'dragging' | 'selecting' | 'resizing';

  /**
   * ID of the event currently being hovered by the mouse
   */
  hoveredEventId: string | null;
}

const initialCalendarState: CalendarState = {
  currentDate: new Date(),
  viewMode: 'month',
  config: DEFAULT_CONFIG,
  uiConfig: DEFAULT_UI_CONFIG,

  events: new Map<string, AnyEvent>(),
  resources: new Map<string, ResourceModel>(),
  weekRowHeight: 0,
  expandedWeekIndex: null,
  dragState: {
    eventId: null,
    grabDate: null,
    hoverDate: null
  },
  resizeState: {
    eventId: null,
    side: null,
    hoverDate: null
  },
  interactionMode: 'none',
  hoveredEventId: null
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
    }),

    /**
     * Minimum height for a week row in month view.
     * Calculated from: CELL_HEADER_HEIGHT + (n * SLOT_HEIGHT) + ((n-1) * SLOT_GAP)
     * where n = visibleEventRows from config.
     */
    minWeekRowHeight: computed(() => {
      const rows = config().visibleEventRows ?? DEFAULT_VISIBLE_EVENT_ROWS
      // Formula: header + (rows * slot height) + (rows * slot gap)
      // The last gap serves as bottom padding for the row.
      return CELL_HEADER_HEIGHT + (rows * SLOT_HEIGHT) + (rows * SLOT_GAP)
    })
  })),
  withMethods((store) => {
    const interaction$ = new Subject<InteractionEvent>();

    return {
      /** Returns the observable stream of all event interactions */
      getInteractions() {
        return interaction$.asObservable();
      },

      /** Dispatches a new interaction event to all subscribers */
      dispatchInteraction(type: InteractionType, eventId: string, payload: any) {
        interaction$.next({ type, eventId, payload });
      },

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
            grid: config.grid
              ? {
                eventSlots: config.grid.eventSlots
                  ? { ...state.uiConfig.grid.eventSlots, ...config.grid.eventSlots }
                  : state.uiConfig.grid.eventSlots,
                overflowIndicator: config.grid.overflowIndicator
                  ? { ...state.uiConfig.grid.overflowIndicator, ...config.grid.overflowIndicator }
                  : state.uiConfig.grid.overflowIndicator
              }
              : state.uiConfig.grid
          }
        }));
      },

      /**
       * Sets the height of a week row container.
       * Called once from the first week's ResizeObserver.
       */
      setWeekRowHeight(height: number) {
        patchState(store, { weekRowHeight: height })
      },

      /**
       * Toggles expansion of a week. Only one week can be expanded at a time.
       * If the same week is toggled twice, it collapses.
       * @param weekIndex - The index of the week to toggle (0-5)
       */
      toggleWeekExpansion(weekIndex: number) {
        const current = store.expandedWeekIndex()
        patchState(store, {
          expandedWeekIndex: current === weekIndex ? null : weekIndex
        })
      },

      // --- Drag & Drop Methods ---
      setDragStart(eventId: string, grabDate: Date) {
        patchState(store, {
          dragState: {
            eventId,
            grabDate,
            hoverDate: null
          }
        })
      },
      setDragHover(date: Date) {
        patchState(store, (state) => ({
          dragState: {
            ...state.dragState,
            hoverDate: date
          }
        }))
      },
      clearDragState() {
        patchState(store, {
          dragState: {
            eventId: null,
            grabDate: null,
            hoverDate: null
          }
        })
      },

      /**
       * Updates the position of the currently dragged event based on the hover date.
       * Calculates the offset between the original grab date and the new hover date.
       */
      updateDraggedEventPosition() {
        const { eventId, grabDate, hoverDate } = store.dragState()
        if (!eventId || !grabDate || !hoverDate) return

        const event = store.events().get(eventId)
        if (!event) return

        const offset = differenceInCalendarDays(hoverDate, grabDate)
        if (offset === 0) return

        if (event.type === 'all-day') {
          const partial: any = {
            date: addDays(event.date, offset)
          }
          if (event.endDate) {
            partial.endDate = addDays(event.endDate, offset)
          }
          this.updateEvent(eventId, partial)
        } else {
          const partial: any = {
            start: addDays(event.start, offset),
            end: addDays(event.end, offset)
          }
          this.updateEvent(eventId, partial)
        }

        // Update the grab date to the new hover date to maintain the relative "grabbed" point
        patchState(store, (state) => ({
          dragState: {
            ...state.dragState,
            grabDate: hoverDate
          }
        }))
      },

      // --- Resizing Methods ---
      setResizeStart(eventId: string, side: ResizeSide) {
        patchState(store, {
          resizeState: {
            eventId,
            side,
            hoverDate: null
          }
        })
      },
      setResizeHover(date: Date) {
        patchState(store, (state) => ({
          resizeState: {
            ...state.resizeState,
            hoverDate: date
          }
        }))
      },
      clearResizeState() {
        patchState(store, {
          resizeState: {
            eventId: null,
            side: null,
            hoverDate: null
          }
        })
      },

      /**
       * Updates the start or end date of the currently resized event based on the hover date.
       */
      updateResizedEvent() {
        const { eventId, side, hoverDate } = store.resizeState()
        if (!eventId || !side || !hoverDate) return

        const event = store.events().get(eventId)
        if (!event) return

        const normalizedHover = startOfDay(hoverDate)

        if (event.type === 'all-day') {
          const partial: any = {}
          const eventDate = startOfDay(event.date)
          const currentEnd = event.endDate ? startOfDay(event.endDate) : eventDate

          if (side === 'left') {
            // Cannot exceed the current end date
            partial.date = normalizedHover > currentEnd ? currentEnd : normalizedHover
          } else if (side === 'right') {
            // Cannot be before the current start date
            partial.endDate = normalizedHover < eventDate ? eventDate : normalizedHover
          }
          this.updateEvent(eventId, partial)
        } else {
          const partial: any = {}
          if (side === 'left') {
            // Cannot exceed end time
            partial.start = hoverDate > event.end ? event.end : hoverDate
          } else if (side === 'right') {
            // Cannot be before start time
            partial.end = hoverDate < event.start ? event.start : hoverDate
          }
          this.updateEvent(eventId, partial)
        }
      },

      // --- Interaction Mutex ---
      setInteractionMode(mode: 'none' | 'dragging' | 'selecting' | 'resizing') {
        patchState(store, { interactionMode: mode })
      },

      // --- Hover State Methods ---
      setHoveredEvent(eventId: string | null) {
        patchState(store, { hoveredEventId: eventId })
      }
    }
  })
);
