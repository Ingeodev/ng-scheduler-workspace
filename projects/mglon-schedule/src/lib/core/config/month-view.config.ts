/**
 * MonthView Layout Constants
 * 
 * All magic numbers for MonthView rendering are centralized here.
 * This ensures consistency and makes adjustments easier.
 */

export const MONTH_VIEW_LAYOUT = {
  // Grid structure
  DAYS_PER_WEEK: 7,
  WEEKS_PER_MONTH: 6,

  // Event sizing (pixels and ems)
  EVENT_HEIGHT_PX: 24,
  EVENT_HEIGHT_EM: 1.5,
  EVENT_SPACING_XS: 4,

  // Cell spacing
  DAY_NUMBER_HEIGHT: 24,
  MORE_INDICATOR_HEIGHT: 20,

  // Percentage calculations
  DAY_WIDTH_PERCENT: 100 / 7, // 14.2857%

  // Overlay positioning offsets
  OVERLAY_OFFSET_Y: 4,

  // Time conversion (for calculations)
  EM_TO_PX_RATIO: 16, // 1em = 16px (browser default)

  // Default colors
  DEFAULT_EVENT_COLOR: '#0860c4'
} as const;

/**
 * Calculated values derived from base constants
 */
export const MONTH_VIEW_COMPUTED = {
  /**
   * Total height of one event slot including spacing
   */
  get SLOT_HEIGHT(): number {
    return MONTH_VIEW_LAYOUT.EVENT_HEIGHT_PX + MONTH_VIEW_LAYOUT.EVENT_SPACING_XS;
  }
} as const;
