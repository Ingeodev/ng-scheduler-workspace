import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getLuminance,
  getContrastRatio,
  getHoverColor,
  getLightBackgroundColor,
  getTextColor,
  generateAdaptiveColorScheme,
  getEventColor
} from './color.helpers';

describe('Color Helpers', () => {

  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle hex without hash', () => {
      expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('should round values', () => {
      expect(rgbToHex(255.7, 128.3, 64.9)).toBe('#1008041');
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance for white', () => {
      const luminance = getLuminance(255, 255, 255);
      expect(luminance).toBeCloseTo(1, 1);
    });

    it('should calculate luminance for black', () => {
      const luminance = getLuminance(0, 0, 0);
      expect(luminance).toBe(0);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast between black and white', () => {
      const black = { r: 0, g: 0, b: 0 };
      const white = { r: 255, g: 255, b: 255 };
      const ratio = getContrastRatio(black, white);
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate contrast between similar colors', () => {
      const gray1 = { r: 128, g: 128, b: 128 };
      const gray2 = { r: 127, g: 127, b: 127 };
      const ratio = getContrastRatio(gray1, gray2);
      expect(ratio).toBeCloseTo(1, 0);
    });
  });

  describe('getHoverColor', () => {
    it('should darken bright colors', () => {
      const baseColor = '#3498db'; // bright blue
      const hoverColor = getHoverColor(baseColor);

      const baseRgb = hexToRgb(baseColor)!;
      const hoverRgb = hexToRgb(hoverColor)!;
      const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
      const hoverHsl = rgbToHsl(hoverRgb.r, hoverRgb.g, hoverRgb.b);

      // Should be darker (lower lightness)
      expect(hoverHsl.l).toBeLessThan(baseHsl.l);
    });

    it('should lighten very dark colors', () => {
      const baseColor = '#0a0a0a'; // very dark
      const hoverColor = getHoverColor(baseColor);

      const baseRgb = hexToRgb(baseColor)!;
      const hoverRgb = hexToRgb(hoverColor)!;
      const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
      const hoverHsl = rgbToHsl(hoverRgb.r, hoverRgb.g, hoverRgb.b);

      // Should be lighter (higher lightness)
      expect(hoverHsl.l).toBeGreaterThan(baseHsl.l);
    });
  });

  describe('getLightBackgroundColor', () => {
    it('should create very light variant', () => {
      const baseColor = '#e91e63'; // pink
      const bgColor = getLightBackgroundColor(baseColor);

      const bgRgb = hexToRgb(bgColor)!;
      const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);

      // Should be very light (high lightness)
      expect(bgHsl.l).toBeGreaterThan(90);
    });

    it('should handle invalid color gracefully', () => {
      const bgColor = getLightBackgroundColor('invalid');
      expect(bgColor).toBe('#f5f5f5');
    });
  });

  describe('getTextColor', () => {
    it('should return white for dark backgrounds', () => {
      const darkBg = '#000000';
      const textColor = getTextColor(darkBg);
      expect(textColor).toBe('#ffffff');
    });

    it('should return dark text for light backgrounds', () => {
      const lightBg = '#ffffff';
      const textColor = getTextColor(lightBg);
      expect(textColor).not.toBe('#ffffff');

      // Should be dark
      const textRgb = hexToRgb(textColor)!;
      const luminance = getLuminance(textRgb.r, textRgb.g, textRgb.b);
      expect(luminance).toBeLessThan(0.5);
    });

    it('should handle invalid color gracefully', () => {
      const textColor = getTextColor('invalid');
      expect(textColor).toBe('#000000');
    });
  });

  describe('generateAdaptiveColorScheme', () => {
    it('should generate complete adaptive scheme', () => {
      const baseColor = '#1a73e8'; // Vivid blue
      const scheme = generateAdaptiveColorScheme(baseColor);

      expect(scheme.vivid.base).toBeDefined();
      expect(scheme.pastel.base).toBeDefined();
      expect(scheme.dark.base).toBeDefined();

      expect(scheme.vivid.hover).toBeDefined();
      expect(scheme.vivid.text).toBeDefined();
      expect(scheme.vivid.textHover).toBeDefined();
    });

    it('should preserve vivid input as vivid', () => {
      const vividGreen = '#228c72';
      const scheme = generateAdaptiveColorScheme(vividGreen);

      expect(scheme.vivid.base).toBe(vividGreen);
      // Pastel should be different (lighter)
      expect(scheme.pastel.base).not.toBe(vividGreen);
    });

    it('should preserve pastel input as pastel', () => {
      const pastelPink = '#fce4ec'; // Very light pink
      const scheme = generateAdaptiveColorScheme(pastelPink);

      expect(scheme.pastel.base).toBe(pastelPink);
      // Vivid should be different (stronger)
      expect(scheme.vivid.base).not.toBe(pastelPink);
    });

    it('should generate accessible text for pastel variant', () => {
      const scheme = generateAdaptiveColorScheme('#7d016f'); // Dark purple
      // Pastel variant of purple should have dark text
      const pastelRgb = hexToRgb(scheme.pastel.base)!;
      const textRgb = hexToRgb(scheme.pastel.text)!;
      const contrast = getContrastRatio(pastelRgb, textRgb);

      expect(contrast).toBeGreaterThan(4.5); // WCAG AA for normal text
    });
  });

  describe('getEventColor', () => {
    it('should return event color when present', () => {
      const event = { color: '#ff0000', resourceId: 'resource-1' };
      const getResource = () => ({ color: '#00ff00' });
      const defaultColor = '#0000ff';

      const result = getEventColor(event, getResource, defaultColor);
      expect(result).toBe('#ff0000');
    });

    it('should return resource color when event color absent', () => {
      const event = { resourceId: 'resource-1' };
      const getResource = () => ({ color: '#00ff00' });
      const defaultColor = '#0000ff';

      const result = getEventColor(event, getResource, defaultColor);
      expect(result).toBe('#00ff00');
    });

    it('should return default color when both absent', () => {
      const event = { resourceId: 'resource-1' };
      const getResource = () => undefined;
      const defaultColor = '#0000ff';

      const result = getEventColor(event, getResource, defaultColor);
      expect(result).toBe('#0000ff');
    });

    it('should return default when no resourceId', () => {
      const event = {};
      const getResource = () => ({ color: '#00ff00' });
      const defaultColor = '#0000ff';

      const result = getEventColor(event, getResource, defaultColor);
      expect(result).toBe('#0000ff');
    });
  });
});
