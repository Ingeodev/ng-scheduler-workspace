import { MONTH_VIEW_LAYOUT, MONTH_VIEW_COMPUTED } from './month-view.config';

describe('Month View Configuration', () => {

  describe('MONTH_VIEW_LAYOUT', () => {
    it('should have correct grid structure constants', () => {
      expect(MONTH_VIEW_LAYOUT.DAYS_PER_WEEK).toBe(7);
      expect(MONTH_VIEW_LAYOUT.WEEKS_PER_MONTH).toBe(6);
    });

    it('should have event sizing constants', () => {
      expect(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_PX).toBe(24);
      expect(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_EM).toBe(1.5);
      expect(MONTH_VIEW_LAYOUT.EVENT_SPACING_XS).toBe(4);
    });

    it('should have cell spacing constants', () => {
      expect(MONTH_VIEW_LAYOUT.DAY_NUMBER_HEIGHT).toBe(24);
      expect(MONTH_VIEW_LAYOUT.MORE_INDICATOR_HEIGHT).toBe(20);
    });

    it('should calculate correct day width percentage', () => {
      expect(MONTH_VIEW_LAYOUT.DAY_WIDTH_PERCENT).toBeCloseTo(14.2857, 4);
    });

    it('should have overlay positioning constants', () => {
      expect(MONTH_VIEW_LAYOUT.OVERLAY_OFFSET_Y).toBe(4);
    });

    it('should have conversion ratios', () => {
      expect(MONTH_VIEW_LAYOUT.EM_TO_PX_RATIO).toBe(16);
    });

    it('should have default color', () => {
      expect(MONTH_VIEW_LAYOUT.DEFAULT_EVENT_COLOR).toBe('#0860c4');
    });
  });

  describe('MONTH_VIEW_COMPUTED', () => {
    it('should calculate slot height correctly', () => {
      const expected = MONTH_VIEW_LAYOUT.EVENT_HEIGHT_PX + MONTH_VIEW_LAYOUT.EVENT_SPACING_XS;
      expect(MONTH_VIEW_COMPUTED.SLOT_HEIGHT).toBe(expected);
      expect(MONTH_VIEW_COMPUTED.SLOT_HEIGHT).toBe(28); // 24 + 4
    });
  });

  describe('Configuration Consistency', () => {
    it('should have consistent EM to PX conversion', () => {
      const emInPx = MONTH_VIEW_LAYOUT.EVENT_HEIGHT_EM * MONTH_VIEW_LAYOUT.EM_TO_PX_RATIO;
      expect(emInPx).toBe(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_PX);
    });

    it('should have all numeric values positive', () => {
      expect(MONTH_VIEW_LAYOUT.DAYS_PER_WEEK).toBeGreaterThan(0);
      expect(MONTH_VIEW_LAYOUT.WEEKS_PER_MONTH).toBeGreaterThan(0);
      expect(MONTH_VIEW_LAYOUT.EVENT_HEIGHT_PX).toBeGreaterThan(0);
      expect(MONTH_VIEW_LAYOUT.EVENT_SPACING_XS).toBeGreaterThan(0);
      expect(MONTH_VIEW_LAYOUT.DAY_NUMBER_HEIGHT).toBeGreaterThan(0);
    });

    it('should have immutable config (as const)', () => {
      // TypeScript will enforce this at compile time
      // This test just verifies the values exist
      expect(MONTH_VIEW_LAYOUT).toBeDefined();
    });
  });
});
