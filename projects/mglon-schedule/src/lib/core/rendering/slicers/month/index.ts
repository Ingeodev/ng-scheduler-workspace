// Public API
export { sliceEventsByWeek } from './month-event-slicer'
export type { SlotConfig } from './slot-config'
export { DEFAULT_SLOT_CONFIG, calculateMinSlotContainerHeight } from './slot-config'
export type { SlotVisibilityResult } from './slot-visibility'
export { partitionSlotsByVisibility } from './slot-visibility'

// Utilities (exported for testing or advanced usage)
export { getEventDateRange } from './event-date-range'
export { determineSlotType } from './slot-type'
export { calculateHorizontalPosition, findAvailableRow, calculateMaxVisibleRows } from './slot-positioning'
