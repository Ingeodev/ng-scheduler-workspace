import { computed } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';
import { ResourceModel } from '../../models/resource';

export interface DataState {
  resources: ResourceModel[];
}

const initialDataState: DataState = {
  resources: []
};

export function withDataFeature() {
  return signalStoreFeature(
    withState(initialDataState),
    withMethods((store) => ({
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
    withComputed(({ resources }) => ({
      resourcesCount: computed(() => resources().length),
      activeResources: computed(() => resources().filter(r => r.isActive !== false)),
      inactiveResources: computed(() => resources().filter(r => r.isActive === false)),
    }))
  );
}

