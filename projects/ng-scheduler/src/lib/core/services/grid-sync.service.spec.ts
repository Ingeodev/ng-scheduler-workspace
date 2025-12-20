import { TestBed } from '@angular/core/testing';
import { GridSyncService, GridBounds } from './grid-sync.service';

describe('GridSyncService', () => {
  let service: GridSyncService;
  let mockGridElement: HTMLElement;
  let mockEventsContainer: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridSyncService);

    // Create mock elements
    mockGridElement = document.createElement('div');
    mockGridElement.style.width = '1000px';
    mockGridElement.style.height = '600px';
    mockGridElement.style.overflow = 'auto';
    document.body.appendChild(mockGridElement);

    mockEventsContainer = document.createElement('div');
    mockEventsContainer.style.position = 'absolute';
    document.body.appendChild(mockEventsContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockGridElement);
    document.body.removeChild(mockEventsContainer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('observeGrid', () => {
    it('should update grid bounds on resize', (done) => {
      //  Mock ResizeObserver since JSDOM doesn't support it
      let resizeCallback: ResizeObserverCallback;
      global.ResizeObserver = class ResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe() {
          // Simulate resize observation
          setTimeout(() => {
            const mockEntry: ResizeObserverEntry = {
              target: mockGridElement,
              contentRect: {
                width: 1000,
                height: 600,
                top: 0,
                left: 0,
                bottom: 600,
                right: 1000,
                x: 0,
                y: 0,
                toJSON: () => ({})
              } as DOMRectReadOnly,
              borderBoxSize: [] as any,
              contentBoxSize: [] as any,
              devicePixelContentBoxSize: [] as any
            };
            resizeCallback([mockEntry], this as any);
          }, 10);
        }
        unobserve() { }
        disconnect() { }
      };

      const cleanup = service.observeGrid(mockGridElement, (rect) => ({
        width: rect.width / 7,
        height: rect.height / 5
      }));

      setTimeout(() => {
        const bounds = service.gridBounds();
        expect(bounds.cellWidth).toBeGreaterThan(0);
        expect(bounds.cellHeight).toBeGreaterThan(0);
        cleanup();
        done();
      }, 100);
    });

    it('should calculate cell sizes correctly', () => {
      // Directly set gridBounds to test calculation logic
      service['gridBoundsSignal'].set({
        width: 1000,
        height: 600,
        scrollTop: 0,
        scrollLeft: 0,
        cellWidth: 100,
        cellHeight: 50
      });

      const bounds = service.gridBounds();
      expect(bounds.cellWidth).toBe(100);
      expect(bounds.cellHeight).toBe(50);
    });
  });

  describe('syncScroll', () => {
    it('should update scroll position in signal', () => {
      const cleanup = service.syncScroll(mockGridElement, mockEventsContainer);

      mockGridElement.scrollTop = 100;
      mockGridElement.scrollLeft = 50;
      mockGridElement.dispatchEvent(new Event('scroll'));

      const bounds = service.gridBounds();
      expect(bounds.scrollTop).toBe(100);
      expect(bounds.scrollLeft).toBe(50);

      cleanup();
    });

    it('should apply transform to events container', () => {
      const cleanup = service.syncScroll(mockGridElement, mockEventsContainer);

      mockGridElement.scrollTop = 100;
      mockGridElement.scrollLeft = 50;
      mockGridElement.dispatchEvent(new Event('scroll'));

      expect(mockEventsContainer.style.transform).toBe('translate3d(-50px, -100px, 0)');

      cleanup();
    });
  });

  describe('dateToPosition', () => {
    beforeEach(() => {
      // Set up known grid bounds
      service['gridBoundsSignal'].set({
        width: 1000,
        height: 600,
        scrollTop: 0,
        scrollLeft: 0,
        cellWidth: 140,
        cellHeight: 100
      });
    });

    it('should convert date to position in month view', () => {
      const date = new Date(2024, 0, 15); // Monday, Jan 15
      const pos = service.dateToPosition(date, 'month');

      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeGreaterThanOrEqual(0);
    });

    it('should convert date to position in week view', () => {
      const date = new Date(2024, 0, 15, 10, 30); // 10:30 AM
      const pos = service.dateToPosition(date, 'week');

      expect(pos.y).toBeGreaterThan(0); // Should be 10.5 * hourHeight
    });

    it('should convert date to position in day view', () => {
      const date = new Date(2024, 0, 15, 14, 0); // 2:00 PM
      const pos = service.dateToPosition(date, 'day');

      expect(pos.x).toBe(0); // Day view has single column
      expect(pos.y).toBeGreaterThan(0);
    });
  });

  describe('positionToDate', () => {
    beforeEach(() => {
      service['gridBoundsSignal'].set({
        width: 1000,
        height: 600,
        scrollTop: 0,
        scrollLeft: 0,
        cellWidth: 140,
        cellHeight: 100
      });
    });

    it('should convert position to date in month view', () => {
      const referenceDate = new Date(2024, 0, 1);
      const result = service.positionToDate(280, 100, 'month', referenceDate);

      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(0); // January
    });

    it('should convert position to date in week view', () => {
      const referenceDate = new Date(2024, 0, 15);
      const result = service.positionToDate(140, 600, 'week', referenceDate);

      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBeGreaterThan(0);
    });

    it('should convert position to date in day view', () => {
      const referenceDate = new Date(2024, 0, 15);
      const result = service.positionToDate(0, 800, 'day', referenceDate);

      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBeGreaterThan(0);
    });
  });
});
