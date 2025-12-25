// Public API
export { sliceEventsByWeek } from './month-event-slicer'
export type { SlotConfig } from './slot-config'
export { DEFAULT_SLOT_CONFIG } from './slot-config'

// Utilities (exported for testing or advanced usage)
export { getEventDateRange } from './event-date-range'
export { determineSlotType } from './slot-type'
export { calculateHorizontalPosition, findAvailableRow } from './slot-positioning'
