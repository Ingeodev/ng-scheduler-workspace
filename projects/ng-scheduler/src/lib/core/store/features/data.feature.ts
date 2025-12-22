import { computed } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';
import { EventModel, ResourceModel } from '../../models/event-model';

export interface DataState {
  events: EventModel[];
  resources: ResourceModel[];
}

const initialDataState: DataState = {
  events: [],
  resources: []
};

export function withDataFeature() {
  return signalStoreFeature(
    withState(initialDataState),
    withMethods((store) => ({
      setEvents(events: EventModel[]) {
        patchState(store, { events });
      },
      addEvent(event: EventModel) {
        patchState(store, (state) => ({ events: [...state.events, event] }));
      },
      removeEvent(id: string) {
        patchState(store, (state) => ({
          events: state.events.filter(e => e.id !== id)
        }));
      },
      updateEvent(id: string, changes: Partial<EventModel>) {
        patchState(store, (state) => ({
          events: state.events.map(e => e.id === id ? { ...e, ...changes } : e)
        }));
      },
      setResources(resources: ResourceModel[]) {
        patchState(store, { resources });
      },
      addResource(resource: ResourceModel) {
        patchState(store, (state) => ({ resources: [...state.resources, resource] }));
      },
      toggleResource(id: string) {
        patchState(store, (state) => ({
          resources: state.resources.map(r =>
            r.id === id ? { ...r, isActive: r.isActive === false ? true : false } : r
          )
        }));
      },
      activateResource(id: string) {
        patchState(store, (state) => ({
          resources: state.resources.map(r =>
            r.id === id ? { ...r, isActive: true } : r
          )
        }));
      },
      deactivateResource(id: string) {
        patchState(store, (state) => ({
          resources: state.resources.map(r =>
            r.id === id ? { ...r, isActive: false } : r
          )
        }));
      }
    })),
    withComputed(({ events, resources }) => ({
      // Aquí podremos agregar selectores derivados, como "eventos por recurso"
      // o validaciones de integridad referencial
      eventsCount: computed(() => events().length),
      resourcesCount: computed(() => resources().length),
      activeResources: computed(() => resources().filter(r => r.isActive !== false)),
      inactiveResources: computed(() => resources().filter(r => r.isActive === false)),
    }))
  );
}
