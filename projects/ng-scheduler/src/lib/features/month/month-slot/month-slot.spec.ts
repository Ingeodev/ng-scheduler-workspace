import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MonthSlot } from './month-slot';
import { CalendarStore } from '../../../core/store/calendar.store';
import { signal } from '@angular/core';
import { SlotModel } from '../../../core/models/slot.model';
import { DEFAULT_UI_CONFIG } from '../../../core/models/ui-config';
import { DEFAULT_CONFIG } from '../../../core/config/default-schedule-config';

describe('MonthSlot', () => {
  let component: MonthSlot;
  let fixture: ComponentFixture<MonthSlot>;
  let mockStore: any;

  const mockSlot: SlotModel = {
    id: 'slot-1',
    idEvent: 'event-1',
    type: 'full',
    start: new Date('2025-12-25'),
    end: new Date('2025-12-25'),
    color: '#3f51b5',
    zIndex: 1,
    position: { top: 0, left: 0, width: 100, height: 25 },
    draggable: true,
    resizable: true
  };

  const mockEvent: any = {
    id: 'event-1',
    title: 'Test Event',
    color: '#3f51b5',
    type: 'event',
    resourceId: 'res-1'
  };

  beforeEach(async () => {
    mockStore = {
      dragState: signal({ eventId: null, grabDate: null, hoverDate: null }),
      resizeState: signal({ eventId: null, side: null, hoverDate: null }),
      hoveredEventId: signal(null),
      interactionMode: signal('none'),
      uiConfig: signal(DEFAULT_UI_CONFIG),
      config: signal(DEFAULT_CONFIG),
      getEvent: jest.fn().mockReturnValue(mockEvent),
      getResource: jest.fn().mockReturnValue({ resizableEvents: true }),
      setHoveredEvent: jest.fn(),
      dispatchInteraction: jest.fn(),
      setInteractionMode: jest.fn(),
      setDragStart: jest.fn(),
      setResizeStart: jest.fn(),
      clearDragState: jest.fn(),
      clearResizeState: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MonthSlot],
      providers: [
        { provide: CalendarStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonthSlot);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slot', mockSlot);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Hover Logic', () => {
    it('should set hovered event in store on mouseEnter if mode is none', () => {
      component.onMouseEnter();
      expect(mockStore.setHoveredEvent).toHaveBeenCalledWith(mockSlot.idEvent);
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('mouseenter', mockSlot.idEvent, expect.any(Object));
    });

    it('should NOT set hovered event if interaction mode is active', () => {
      mockStore.interactionMode.set('dragging');
      component.onMouseEnter();
      expect(mockStore.setHoveredEvent).not.toHaveBeenCalled();
    });

    it('should clear hovered event in store on mouseLeave', () => {
      component.onMouseLeave();
      expect(mockStore.setHoveredEvent).toHaveBeenCalledWith(null);
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('mouseleave', mockSlot.idEvent, expect.any(Object));
    });
  });

  describe('Click Logic (De-confliction)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should dispatch click after a delay', () => {
      const event = new MouseEvent('click');
      component.onClick(event);

      expect(mockStore.dispatchInteraction).not.toHaveBeenCalled();

      jest.advanceTimersByTime(250);
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('click', mockSlot.idEvent, expect.any(Object));
    });

    it('should dispatch dblclick and cancel pending click', () => {
      const event1 = new MouseEvent('click');
      const event2 = new MouseEvent('dblclick');

      component.onClick(event1);
      jest.advanceTimersByTime(100);
      component.onDblClick(event2);

      jest.advanceTimersByTime(200); // Exceed original 250ms

      expect(mockStore.dispatchInteraction).not.toHaveBeenCalledWith('click', expect.any(String), expect.any(Object));
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('dblclick', mockSlot.idEvent, expect.any(Object));
    });

    it('should ignore click if ignoreNextClick is set (after drag/resize)', () => {
      // We simulate ignoreNextClick by calling onGlobalUp (internal logic)
      // Since it's private, we check the behavior of onClick directly
      (component as any).ignoreNextClick = true;

      const event = new MouseEvent('click');
      component.onClick(event);

      jest.advanceTimersByTime(250);
      expect(mockStore.dispatchInteraction).not.toHaveBeenCalled();
      expect((component as any).ignoreNextClick).toBeFalsy();
    });
  });

  describe('Context Menu', () => {
    it('should dispatch contextmenu and prevent default', () => {
      const event = new MouseEvent('contextmenu');
      const spy = jest.spyOn(event, 'preventDefault');

      component.onContextMenu(event);

      expect(spy).toHaveBeenCalled();
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('contextmenu', mockSlot.idEvent, expect.any(Object));
    });
  });

  describe('Drag & Resize Initialization', () => {
    it('should start drag on pointerdown if not a resize handle', () => {
      const event = new PointerEvent('pointerdown', { button: 0, clientX: 50, clientY: 50 });
      // In tests, currentTarget must be manually defined if calling handler directly
      Object.defineProperty(event, 'currentTarget', { value: fixture.nativeElement });

      // We need to mock getBoundingClientRect for element to calculate click position
      jest.spyOn(fixture.nativeElement, 'getBoundingClientRect').mockReturnValue({
        left: 0, top: 0, width: 100, height: 25
      } as any);

      component.onPointerDown(event);

      expect(mockStore.setInteractionMode).toHaveBeenCalledWith('dragging');
      // We can't easily wait for the timer here without fakeAsync or spying on initiateDrag
    });

    it('should start resize on resizeStart', () => {
      const event: any = { side: 'left' };
      component.onResizeStart(event);

      expect(mockStore.setResizeStart).toHaveBeenCalledWith(mockSlot.idEvent, 'left');
      expect(mockStore.dispatchInteraction).toHaveBeenCalledWith('resizeStart', mockSlot.idEvent, expect.any(Object));
    });
  });
});
