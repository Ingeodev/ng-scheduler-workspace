import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnyEvent, Event, AllDayEvent, RecurrentEvent } from '../models/event';
import { Resource } from '../models/resource';

/**
 * State interface for the Event Store
 */
type EventState = {
  events: Map<string, AnyEvent>;
  resources: Map<string, Resource>;
};

/**
 * Initial state for the Event Store
 */
const initialState: EventState = {
  events: new Map(),
  resources: new Map(),
};

/**
 * Event Store - Manages events and resources using ngrx/signals
 * 
 * This store provides reactive state management for declarative events and resources
 * in the scheduler. It uses ngrx/signals for predictable state updates and computed values.
 */
export const EventStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ events, resources }) => ({
    /**
     * Returns all events as an array
     */
    allEvents: computed(() => Array.from(events().values())),

    /**
     * Returns all resources as an array
     */
    allResources: computed(() => Array.from(resources().values())),

    /**
     * Returns count of registered events
     */
    eventCount: computed(() => events().size),

    /**
     * Returns count of registered resources
     */
    resourceCount: computed(() => resources().size),
  })),

  withMethods((store) => ({
    /**
     * Registers a new event in the store
     */
    registerEvent(event: AnyEvent): void {
      patchState(store, (state) => {
        const newEvents = new Map(state.events);
        newEvents.set(event.id, event);
        return { events: newEvents };
      });
    },

    /**
     * Updates an existing event
     */
    updateEvent(id: string, updates: Partial<AnyEvent>): void {
      patchState(store, (state) => {
        const newEvents = new Map(state.events);
        const existing = newEvents.get(id);
        if (existing) {
          newEvents.set(id, { ...existing, ...updates } as AnyEvent);
        }
        return { events: newEvents };
      });
    },

    /**
     * Removes an event from the store
     */
    unregisterEvent(id: string): void {
      patchState(store, (state) => {
        const newEvents = new Map(state.events);
        newEvents.delete(id);
        return { events: newEvents };
      });
    },

    /**
     * Gets a specific event by ID
     */
    getEvent(id: string): AnyEvent | undefined {
      return store.events().get(id);
    },

    /**
     * Gets all events for a specific resource
     */
    getEventsByResource(resourceId: string): AnyEvent[] {
      return store.allEvents().filter(event => event.resourceId === resourceId);
    },

    /**
     * Registers a new resource in the store
     */
    registerResource(resource: Resource): void {
      patchState(store, (state) => {
        const newResources = new Map(state.resources);
        newResources.set(resource.id, resource);
        return { resources: newResources };
      });
    },

    /**
     * Updates an existing resource
     */
    updateResource(id: string, updates: Partial<Resource>): void {
      patchState(store, (state) => {
        const newResources = new Map(state.resources);
        const existing = newResources.get(id);
        if (existing) {
          newResources.set(id, { ...existing, ...updates });
        }
        return { resources: newResources };
      });
    },

    /**
     * Removes a resource from the store
     */
    unregisterResource(id: string): void {
      patchState(store, (state) => {
        const newResources = new Map(state.resources);
        newResources.delete(id);
        return { resources: newResources };
      });
    },

    /**
     * Gets a specific resource by ID
     */
    getResource(id: string): Resource | undefined {
      return store.resources().get(id);
    },

    /**
     * Clears all events and resources from the store
     */
    clear(): void {
      patchState(store, {
        events: new Map(),
        resources: new Map(),
      });
    },
  }))
);
