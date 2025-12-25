/**
 * Configuration for slot positioning in month view.
 */
export interface SlotConfig {
  /** Height of each slot row in pixels */
  slotHeight: number
  /** Vertical gap between slots in pixels */
  slotGap: number
}

export const DEFAULT_SLOT_CONFIG: SlotConfig = {
  slotHeight: 20,
  slotGap: 2
}
