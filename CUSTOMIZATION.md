# ng-scheduler Customization Guide

This document lists all customizable CSS variables available in the ng-scheduler library, organized by component and feature area.

## Table of Contents

- [Global Theme Variables](#global-theme-variables)
- [Schedule Component](#schedule-component)
- [Sidebar](#sidebar)
- [Header](#header)
- [Month View](#month-view)
  - [Month Grid](#month-grid)
  - [Month Cell](#month-cell)
  - [Month Slot (Events)](#month-slot-events)
  - [Month Toggle Column](#month-toggle-column)
- [Week View](#week-view)
- [Resource View](#resource-view)
- [Shared Components](#shared-components)
  - [Avatar](#avatar)
  - [Buttons](#buttons)

---

## Global Theme Variables

These variables are defined in `_variables.scss` and can be overridden globally or per-component.

### Color Palette

#### Primary Colors
```css
--mglon-schedule-primary-50: #e8f0fe;
--mglon-schedule-primary-100: #d2e3fc;
--mglon-schedule-primary-200: #a7cbfb;
--mglon-schedule-primary-300: #7cacf8;
--mglon-schedule-primary-400: #518ef5;
--mglon-schedule-primary-500: #1a73e8; /* Base Primary */
--mglon-schedule-primary-600: #1967d2;
--mglon-schedule-primary-700: #185abc;
--mglon-schedule-primary-800: #174ea6;
--mglon-schedule-primary-900: #0d3a86;
--mglon-schedule-primary-950: #08265a;
```

#### Neutral Colors
```css
--mglon-schedule-neutral-50: #fafafa;
--mglon-schedule-neutral-100: #f5f5f5;
--mglon-schedule-neutral-200: #e5e5e5;
--mglon-schedule-neutral-300: #d4d4d4;
--mglon-schedule-neutral-400: #a3a3a3;
--mglon-schedule-neutral-500: #737373;
--mglon-schedule-neutral-600: #525252;
--mglon-schedule-neutral-700: #404040;
--mglon-schedule-neutral-800: #262626;
--mglon-schedule-neutral-900: #171717;
--mglon-schedule-neutral-950: #0a0a0a;
```

### Semantic Colors

#### Surface & Background
```css
--mglon-schedule-primary: var(--mglon-schedule-primary-500);
--mglon-schedule-on-primary: #ffffff;

--mglon-schedule-surface: #ffffff;
--mglon-schedule-on-surface: var(--mglon-schedule-neutral-900);
--mglon-schedule-surface-variant: var(--mglon-schedule-neutral-100);
--mglon-schedule-on-surface-variant: var(--mglon-schedule-neutral-700);
--mglon-schedule-background: #ffffff;
--mglon-schedule-on-background: var(--mglon-schedule-neutral-900);
```

#### Text Colors
```css
--mglon-schedule-text-primary: var(--mglon-schedule-neutral-900);
--mglon-schedule-text-secondary: var(--mglon-schedule-neutral-500);
--mglon-schedule-text-tertiary: var(--mglon-schedule-neutral-400);
```

#### States
```css
--mglon-schedule-hover: var(--mglon-schedule-neutral-100);
--mglon-schedule-hover-bg: rgba(0, 0, 0, 0.04);
--mglon-schedule-selection: var(--mglon-schedule-primary-50);
--mglon-schedule-focus-ring-color: var(--mglon-schedule-primary-200);
--mglon-schedule-disabled-opacity: 0.5;
```

#### Error/Danger
```css
--mglon-schedule-error: #ea4335;
--mglon-schedule-on-error: #ffffff;
```

### Spacing

```css
--mglon-schedule-spacing-xs: 4px;
--mglon-schedule-spacing-sm: 8px;
--mglon-schedule-spacing-md: 16px;
--mglon-schedule-spacing-lg: 24px;

--mglon-schedule-padding-xs: var(--mglon-schedule-spacing-xs);
--mglon-schedule-padding-sm: var(--mglon-schedule-spacing-sm);
--mglon-schedule-padding-md: var(--mglon-schedule-spacing-md);
--mglon-schedule-padding-lg: var(--mglon-schedule-spacing-lg);

--mglon-schedule-margin-xs: var(--mglon-schedule-spacing-xs);
--mglon-schedule-margin-sm: var(--mglon-schedule-spacing-sm);
--mglon-schedule-margin-md: var(--mglon-schedule-spacing-md);
--mglon-schedule-margin-lg: var(--mglon-schedule-spacing-lg);

--mglon-schedule-gap-xs: var(--mglon-schedule-spacing-xs);
--mglon-schedule-gap-sm: var(--mglon-schedule-spacing-sm);
--mglon-schedule-gap-md: var(--mglon-schedule-spacing-md);
--mglon-schedule-gap-lg: var(--mglon-schedule-spacing-lg);
```

### Border Radius

```css
--mglon-schedule-radius-sm: 4px;
--mglon-schedule-radius-md: 8px;
--mglon-schedule-radius-lg: 16px;
--mglon-schedule-radius-full: 9999px;
```

### Borders

```css
--mglon-schedule-border: var(--mglon-schedule-neutral-200);
--mglon-schedule-border-width-sm: 1px;
--mglon-schedule-border-width-md: 2px;
--mglon-schedule-border-width-lg: 4px;
```

### Sizing

```css
--mglon-schedule-header-height: 48px;
--mglon-schedule-sidebar-width: 60px;
--mglon-schedule-cell-height: 48px;
```

### Typography

```css
--mglon-schedule-font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
--mglon-schedule-font-size-xs: 10px;
--mglon-schedule-font-size-sm: 12px;
--mglon-schedule-font-size-md: 14px;
--mglon-schedule-font-size-lg: 16px;
```

### Shadows

```css
--mglon-schedule-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
--mglon-schedule-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.15);
--mglon-schedule-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.2);
```

### Z-Index

```css
--mglon-schedule-z-sticky: 10;
--mglon-schedule-z-header: 20;
```

### Animations

```css
--mglon-schedule-transition-duration: 200ms;
--mglon-schedule-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Schedule Component

The root schedule component container.

### Variables

```css
/* Inherited from global variables */
--mglon-schedule-background
--mglon-schedule-on-background
--mglon-schedule-font-family
```

### UIConfig Support

- `headerUI`: Controls header area appearance
- `sidebarUI`: Controls sidebar appearance and visibility
- `gridUI`: Controls event slots and grid elements

---

## Sidebar

Sidebar component for resource list.

### Component-Specific Variables

```css
--mglon-sidebar-bg: /* Background color (defaults to --mglon-schedule-surface) */
--mglon-sidebar-radius: /* Border radius (configured via UIConfig) */
```

### UIConfig Properties

**TypeScript Configuration:**
```typescript
sidebarUI: {
  background: '#f8f9fa',  // Custom background color
  rounded: 'sm',           // Border radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  resourceItems: {
    rounded: 'sm',         // Item border radius
    density: 'comfortable' // 'compact' | 'comfortable'
  }
}
```

### Inherited Variables

```css
--mglon-schedule-surface
--mglon-schedule-border
--mglon-schedule-background
--mglon-schedule-text-primary
--mglon-schedule-spacing-md
--mglon-schedule-spacing-sm
```

---

## Header

Header component containing navigation and view controls.

### UIConfig Properties

**TypeScript Configuration:**
```typescript
headerUI: {
  buttonGroup: {
    appearance: 'solid',    // 'solid' | 'outline' | 'ghost'
    rounded: 'md',          // Border radius
    density: 'comfortable'  // 'compact' | 'comfortable'
  },
  iconButtons: {
    rounded: 'md'           // Border radius for icon buttons
  },
  todayButton: {
    rounded: 'md',          // Border radius
    appearance: 'ghost'     // 'solid' | 'outline' | 'ghost'
  }
}
```

### Inherited Variables

```css
--mglon-schedule-surface
--mglon-schedule-border
--mglon-schedule-primary
--mglon-schedule-text-primary
--mglon-schedule-spacing-sm
--mglon-schedule-spacing-md
--mglon-schedule-hover
--mglon-schedule-selection
```

---

## Month View

### Month Grid

Container for the month calendar grid.

### Variables

```css
--mglon-schedule-month-week-display: grid;
--mglon-schedule-month-week-columns: repeat(7, 1fr);
--mglon-schedule-month-week-min-height: 80px;
--mglon-schedule-month-week-border-bottom-width: 1px;
```

### Month Cell

Individual day cells in the month grid.

### Variables

```css
/* Cell hover state */
--mglon-schedule-hover

/* Drag-over state */
--mglon-schedule-primary-100 /* Used for drag-over highlight */
```

### Month Slot (Events)

Event display slots within month view.

### Component-Specific Variables

```css
--slot-radius: /* Event border radius (configured via UIConfig) */
--slot-bg: /* Event background color */
--slot-hover: /* Event hover state color */
--slot-text: /* Event text color */
```

### UIConfig Properties

**TypeScript Configuration:**
```typescript
gridUI: {
  eventSlots: {
    rounded: 'sm',  // 'none' | 'sm' | 'full'
    color: '#1a73e8' // Default event color if not specified
  },
  useDynamicColors: true // If true, generates vivid/pastel palettes automatically
}
```

### Inherited Variables

```css
--mglon-schedule-radius-sm
--mglon-schedule-shadow-sm
```

### Month Toggle Column

Overflow indicators and expand/collapse controls.

### Component-Specific Variables

```css
--mglon-toggle-radius: /* Border radius for toggle button */
--mglon-toggle-bg: /* Background color */
--mglon-toggle-hover: /* Hover state background */
--mglon-toggle-text: /* Text color */
```

### UIConfig Properties

**TypeScript Configuration:**
```typescript
gridUI: {
  overflowIndicator: {
    rounded: 'sm',      // 'none' | 'sm' | 'md' | 'full'
    appearance: 'ghost' // 'ghost' | 'outline' | 'solid'
  }
}
```

---

## Week View

Week calendar view components.

### Inherited Variables

```css
--mglon-schedule-surface
--mglon-schedule-border
--mglon-schedule-text-secondary
--mglon-schedule-hover
--mglon-schedule-cell-height
```

---

## Resource View

Timeline view organized by resources.

### Component-Specific Variables

```css
--resource-view-bg: var(--mglon-resource-view-bg, var(--mglon-schedule-background));
--resource-view-font-family: var(--mglon-resource-view-font-family, var(--mglon-schedule-font-family));
--resource-view-text-color: var(--mglon-resource-view-text-color, var(--mglon-schedule-text-primary));
--resource-sidebar-width: var(--mglon-resource-sidebar-width, var(--mglon-schedule-sidebar-width));
--resource-header-height: var(--mglon-resource-header-height, var(--mglon-schedule-header-height));
--resource-cell-height: var(--mglon-resource-cell-height, var(--mglon-schedule-cell-height));
--resource-border: var(--mglon-resource-border, 1px solid var(--mglon-schedule-border));
```

---

## Shared Components

### Avatar

User/resource avatar component with initials support.

### Inherited Variables

```css
--mglon-schedule-surface  /* Default background for placeholder */
--mglon-schedule-text-secondary /* Default text color */
```

### Custom Properties

Avatars can receive custom `color` and `name` inputs for dynamic styling with automatic contrast calculation.

### Buttons

#### Button

Standard button component.

### Inherited Variables

```css
--mglon-schedule-primary
--mglon-schedule-on-primary
--mglon-schedule-border
--mglon-schedule-hover
--mglon-schedule-text-primary
--mglon-schedule-radius-md
--mglon-schedule-transition-duration
```

#### Button Group

Grouped button component for view switchers.

### UIConfig Properties

Configured via `headerUI.buttonGroup` (see [Header](#header) section).

#### Icon Button

Icon-only button for navigation controls.

### UIConfig Properties

Configured via `headerUI.iconButtons` (see [Header](#header) section).

#### FAB Button

Floating action button.

### Inherited Variables

```css
--mglon-schedule-primary
--mglon-schedule-on-primary
--mglon-schedule-shadow-md
--mglon-schedule-radius-full
```

---

## Usage Examples

### Globally Override Primary Color

```scss
:root {
  --mglon-schedule-primary: #10b981; // Green
  --mglon-schedule-primary-50: #d1fae5;
  --mglon-schedule-primary-500: #10b981;
  // ... update other shades
}
```

### Component-Specific Override

```typescript
@Component({
  selector: 'my-schedule',
  template: '<mglon-schedule [sidebarUI]="sidebarConfig"></mglon-schedule>',
  styles: [`
    ::ng-deep {
      --mglon-sidebar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --mglon-sidebar-radius: var(--mglon-schedule-radius-lg);
    }
  `]
})
```

### UIConfig Example

```typescript
const config: Partial<UIConfig> = {
  header: {
    buttonGroup: { appearance: 'outline', rounded: 'lg', density: 'compact' },
    iconButtons: { rounded: 'full' },
    todayButton: { rounded: 'md', appearance: 'solid' }
  },
  sidebar: {
    background: '#f9fafb',
    rounded: 'md',
    resourceItems: { rounded: 'full', density: 'compact' }
  },
  grid: {
    eventSlots: { rounded: 'sm', color: '#1a73e8' },
    overflowIndicator: { rounded: 'full', appearance: 'solid' }
  }
};
```

---

## Best Practices

1. **Use semantic variables** (`--mglon-schedule-surface`) instead of raw colors when possible
2. **Respect the on-surface pattern** for text colors to ensure proper contrast
3. **Test with different themes** if you plan to support dark mode
4. **Override at the appropriate level**: global for theme, component-specific for customization
5. **Use UIConfig** for supported variants rather than direct CSS overrides when available

---

## Future Enhancements

- Dark mode support with automatic theme switching
- Additional surface elevation levels (surface-1, surface-2, surface-3)
- More color semantic aliases for success, warning, info states
- CSS custom property fallbacks for older browser support
