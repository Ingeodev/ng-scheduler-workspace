/*
 * Public API Surface of ng-scheduler
 */

export * from './lib/features/resource/resource-view/resource-view';
export * from './lib/features/week/week-view/week-view';
export * from './lib/features/schedule/schedule/schedule';

// Declarative Event Components
export * from './lib/features/events';

// Event Store
export * from './lib/core/store/event.store';

// Selection Types
export type { SelectionResult } from './lib/core/background-selection/selectable/selectable.directive';

// Buttons
export * from './lib/core/models/config-schedule';
export * from './lib/shared/components/buttons/index';

// UI Configuration
export * from './lib/core/models/ui-config';
