import {
  SLOT_HEIGHT,
  SLOT_GAP
} from '../../../config/default-schedule-config'

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
  slotHeight: SLOT_HEIGHT,
  slotGap: SLOT_GAP
}

/**
 * Calculates the minimum height required to display a given number of event rows.
 * 
 * Formula: (n * slotHeight) + ((n - 1) * slotGap)
 * - For n=3 with defaults (20px height, 2px gap):
 *   (3 * 20) + (2 * 2) = 60 + 4 = 64px
 * 
 * @param rows - Number of event rows to display
 * @param config - Slot configuration (height and gap)
 * @returns Minimum height in pixels
 */
export function calculateMinSlotContainerHeight(
  rows: number,
  config: SlotConfig = DEFAULT_SLOT_CONFIG
): number {
  if (rows <= 0) return 0

  const totalSlotHeight = rows * config.slotHeight
  const totalGapHeight = (rows - 1) * config.slotGap

  return totalSlotHeight + totalGapHeight
}
