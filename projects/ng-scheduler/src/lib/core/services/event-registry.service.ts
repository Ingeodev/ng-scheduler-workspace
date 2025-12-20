import { Injectable, signal, computed } from '@angular/core';
import { AnyEvent, Event, AllDayEvent, RecurrentEvent } from '../models/event';
import { Resource } from '../models/resource';

/**
 * Service to manage and track declarative events and resources.
 * Implements the Repository pattern for event storage and retrieval.
 */
@Injectable({
  providedIn: 'root'
})
export class EventRegistryService {
  // Internal storage using signals for reactivity
  private readonly _events = signal<Map<string, AnyEvent>>(new Map());
  private readonly _resources = signal<Map<string, Resource>>(new Map());

  // Public read-only computed signals
  readonly events = computed(() => Array.from(this._events().values()));
  readonly resources = computed(() => Array.from(this._resources().values()));

  /**
   * Registers a new event
   */
  registerEvent(event: AnyEvent): void {
    this._events.update(events => {
      const newMap = new Map(events);
      newMap.set(event.id, event);
      return newMap;
    });
  }

  /**
   * Updates an existing event
   */
  updateEvent(id: string, updates: Partial<AnyEvent>): void {
    this._events.update(events => {
      const newMap = new Map(events);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return newMap;
    });
  }

  /**
   * Removes an event from the registry
   */
  unregisterEvent(id: string): void {
    this._events.update(events => {
      const newMap = new Map(events);
      newMap.delete(id);
      return newMap;
    });
  }

  /**
   * Gets a specific event by ID
   */
  getEvent(id: string): AnyEvent | undefined {
    return this._events().get(id);
  }

  /**
   * Gets all events for a specific resource
   */
  getEventsByResource(resourceId: string): AnyEvent[] {
    return this.events().filter(event => event.resourceId === resourceId);
  }

  /**
   * Registers a new resource
   */
  registerResource(resource: Resource): void {
    this._resources.update(resources => {
      const newMap = new Map(resources);
      newMap.set(resource.id, resource);
      return newMap;
    });
  }

  /**
   * Updates an existing resource
   */
  updateResource(id: string, updates: Partial<Resource>): void {
    this._resources.update(resources => {
      const newMap = new Map(resources);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return newMap;
    });
  }

  /**
   * Removes a resource from the registry
   */
  unregisterResource(id: string): void {
    this._resources.update(resources => {
      const newMap = new Map(resources);
      newMap.delete(id);
      return newMap;
    });
  }

  /**
   * Gets a specific resource by ID
   */
  getResource(id: string): Resource | undefined {
    return this._resources().get(id);
  }

  /**
   * Clears all events and resources (useful for cleanup)
   */
  clear(): void {
    this._events.set(new Map());
    this._resources.set(new Map());
  }
}
