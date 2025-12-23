/**
 * Color manipulation utilities for dynamic theming
 */

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Calculate relative luminance (WCAG formula)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Generates a hover color (darker variant)
 * If the base color is already dark, it slightly lightens instead
 */
export function getHoverColor(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // If color is very dark (L < 20%), lighten it
  // Otherwise, darken it
  if (hsl.l < 20) {
    hsl.l = Math.min(100, hsl.l + 15);
    hsl.s = Math.min(100, hsl.s + 10);
  } else {
    hsl.l = Math.max(0, hsl.l - 12);
    hsl.s = Math.min(100, hsl.s + 8);
  }

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generates a very light background variant (almost white)
 */
export function getLightBackgroundColor(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return '#f5f5f5';

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Keep the hue, reduce saturation, increase lightness to 95-97%
  hsl.s = Math.min(30, hsl.s * 0.3);
  hsl.l = 96;

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generates optimal text color (white or dark) for contrast
 * Returns white for dark backgrounds, dark for light backgrounds
 */
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';

  // Calculate luminance
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

  // If background is light (luminance > 0.5), use dark text
  // Otherwise use white text
  if (luminance > 0.5) {
    // For very light backgrounds, use a dark gray/color-tinted text
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    // Keep hue, high saturation, low lightness
    const textHsl = { h: hsl.h, s: Math.min(60, hsl.s * 0.8), l: 25 };
    const textRgb = hslToRgb(textHsl.h, textHsl.s, textHsl.l);
    return rgbToHex(textRgb.r, textRgb.g, textRgb.b);
  } else {
    return '#ffffff';
  }
}

/**
 * Complete color scheme generator
 * Returns all three derived colors at once
 */
export interface EventColorScheme {
  base: string;          // Original color
  hover: string;         // Darker/stronger for hover
  background: string;    // Very light variant
  text: string;          // Optimal contrast text color
}

export function generateEventColorScheme(baseColor: string): EventColorScheme {
  return {
    base: baseColor,
    hover: getHoverColor(baseColor),
    background: getLightBackgroundColor(baseColor),
    text: getTextColor(baseColor)
  };
}

/**
 * Resolves the effective color for an event
 * 
 * Resolution order:
 * 1. event.color (event-specific)
 * 2. resource.color (inherited from resource)
 * 3. defaultColor (fallback)
 * 
 * @param event - The event to get color for
 * @param getResource - Function to retrieve resource by ID
 * @param defaultColor - Fallback color if none found
 */
export function getEventColor(
  event: { color?: string; resourceId?: string },
  getResource: (id: string) => { color?: string } | undefined,
  defaultColor: string
): string {
  // 1. Event-specific color
  if (event.color) return event.color;

  // 2. Resource color
  if (event.resourceId) {
    const resource = getResource(event.resourceId);
    if (resource?.color) return resource.color;
  }

  // 3. Default
  return defaultColor;
}
