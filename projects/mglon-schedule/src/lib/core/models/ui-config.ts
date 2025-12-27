/**
 * UI Configuration Types
 * 
 * Type definitions organized by functional areas (Header, Sidebar, Grid)
 * for controlling the visual appearance of schedule components.
 */

/**
 * Border radius levels based on design system
 */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Density variants for spacing and sizing
 */
export type Density = 'compact' | 'comfortable';

/**
 * Appearance styles for components
 */
export type Appearance = 'solid' | 'outline' | 'ghost';

// =============================================================================
// HEADER CONFIGURATION
// =============================================================================

/**
 * Configuration for button group component in header (view switcher)
 */
export interface ButtonGroupConfig {
  /**
   * Visual appearance style
   * @default 'solid'
   */
  appearance: Appearance;

  /**
   * Border radius for button group
   * @default 'md'
   */
  rounded: BorderRadius;

  /**
   * Density/spacing for buttons
   * @default 'comfortable'
   */
  density: Density;
}

/**
 * Configuration for icon buttons in header (navigation, add button)
 */
export interface IconButtonConfig {
  /**
   * Border radius for icon buttons
   * @default 'md'
   */
  rounded: BorderRadius;
}

/**
 * Configuration for Today button in header
 */
export interface TodayButtonConfig {
  /**
   * Border radius for Today button
   * @default 'md'
   */
  rounded: BorderRadius;

  /**
   * Visual appearance style
   * @default 'ghost'
   */
  appearance: Appearance;
}

/**
 * Complete configuration for header area
 */
export interface HeaderUIConfig {
  /**
   * View switcher button group configuration
   */
  buttonGroup: ButtonGroupConfig;

  /**
   * Icon buttons (prev/next/add) configuration
   */
  iconButtons: IconButtonConfig;

  /**
   * Today button configuration
   */
  todayButton: TodayButtonConfig;
}

// =============================================================================
// SIDEBAR CONFIGURATION
// =============================================================================

/**
 * Configuration for resource items in sidebar
 */
export interface ResourceItemConfig {
  /**
   * Border radius for resource items
   * @default 'sm'
   */
  rounded: BorderRadius;

  /**
   * Density/spacing for resource items
   * @default 'comfortable'
   */
  density: Density;
}

/**
 * Complete configuration for sidebar area
 */
export interface SidebarUIConfig {
  /**
   * Resource list item configuration
   */
  resourceItems: ResourceItemConfig;

  /**
   * Background color for sidebar container
   * @default '#ffffff' or 'var(--bg-color)'
   */
  background?: string;

  /**
   * Border radius for sidebar container
   * @default 'none'
   */
  rounded?: BorderRadius;
}

// =============================================================================
// GRID CONFIGURATION
// =============================================================================

/** Event slot specific radius options */
export type EventSlotRadius = 'none' | 'sm' | 'full'

/** Overflow indicator specific radius options */
export type IndicatorRadius = 'none' | 'sm' | 'md' | 'full'

/** Overflow indicator appearance options */
export type IndicatorAppearance = 'ghost' | 'outline' | 'solid'

/**
 * Configuration for event slots in grids
 */
export interface EventSlotConfig {
  /**
   * Border radius for event slots
   * @default 'sm'
   */
  rounded: EventSlotRadius;

  /**
   * Default color for event slots if not specified by event or resource
   * @default undefined (falls back to primary style)
   */
  color?: string;
}

/**
 * Configuration for overflow indicator (+N more)
 */
export interface OverflowIndicatorConfig {
  /**
   * Border radius for indicator
   * @default 'sm'
   */
  rounded: IndicatorRadius

  /**
   * Visual appearance style
   * @default 'ghost'
   */
  appearance: IndicatorAppearance
}

/**
 * Complete configuration for grid area
 */
export interface GridUIConfig {
  /**
   * Event slot styling
   */
  eventSlots: EventSlotConfig

  /**
   * Overflow indicator (+N more) styling
   */
  overflowIndicator: OverflowIndicatorConfig

  /**
   * Whether to automatically generate vivid/pastel variants for events.
   * If true, regular events use vivid colors and recurrent events use pastel variants.
   * If false, colors are used exactly as provided (with derived contrast text).
   * @default true
   */
  useDynamicColors: boolean;
}


// =============================================================================
// ROOT CONFIGURATION
// =============================================================================

/**
 * Complete UI configuration for the schedule
 * Organized by functional area for better discoverability
 */
export interface UIConfig {
  /**
   * Header area configuration (button-group, navigation, today button)
   */
  header: HeaderUIConfig;

  /**
   * Sidebar area configuration (resource items)
   */
  sidebar: SidebarUIConfig;

  /**
   * Grid area configuration (event slots, overflow indicators)
   */
  grid: GridUIConfig;
}

/**
 * Default UI configuration
 */
export const DEFAULT_UI_CONFIG: UIConfig = {
  header: {
    buttonGroup: {
      appearance: 'solid',
      rounded: 'md',
      density: 'comfortable'
    },
    iconButtons: {
      rounded: 'md'
    },
    todayButton: {
      rounded: 'md',
      appearance: 'ghost'
    }
  },
  sidebar: {
    resourceItems: {
      rounded: 'sm',
      density: 'comfortable'
    }
  },
  grid: {
    eventSlots: {
      rounded: 'sm'
    },
    overflowIndicator: {
      rounded: 'sm',
      appearance: 'ghost'
    },
    useDynamicColors: true
  }
} as const
