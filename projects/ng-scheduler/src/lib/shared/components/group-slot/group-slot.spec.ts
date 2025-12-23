import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupSlotComponent, GroupSlot } from './group-slot';
import { Event } from '../../../core/models/event';

describe('GroupSlotComponent', () => {
  let component: GroupSlotComponent;
  let fixture: ComponentFixture<GroupSlotComponent>;

  const mockEvent: Event = {
    id: 'evt-1',
    title: 'Test Event',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
    type: 'event'
  };

  const mockSlot: GroupSlot = {
    renderData: {
      position: {
        top: 50,
        left: 100,
        width: 200,
        height: 24
      },
      zIndex: 1,
      isStart: true,
      isEnd: true,
      layout: {
        column: 0,
        overlap: 0,
        totalOverlaps: 1
      },
      isDragging: false,
      isResizing: false,
      isHovered: false,
      isSelected: false
    },
    style: {
      '--event-x': '100px',
      '--event-y': '50px',
      '--event-width': '200px',
      '--event-height': '24px',
      '--event-z': 1,
      '--event-color': '#e91e63',
      '--event-hover-color': '#c2185b',
      '--event-bg-color': '#fce4ec',
      '--event-text-color': '#ffffff'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSlotComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupSlotComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('slots', [mockSlot]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should render event title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.group-slot__title');

      expect(title?.textContent).toBe('Test Event');
    });

    it('should show time when showTime is true', () => {
      fixture.componentRef.setInput('showTime', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const time = compiled.querySelector('.group-slot__time');

      expect(time).toBeTruthy();
      expect(time?.textContent).toContain('AM');
    });

    it('should hide time when showTime is false', () => {
      fixture.componentRef.setInput('showTime', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const time = compiled.querySelector('.group-slot__time');

      expect(time).toBeNull();
    });

    it('should apply positioning styles', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot') as HTMLElement;

      const style = slot.style;
      expect(style.getPropertyValue('--event-x')).toBe('100px');
      expect(style.getPropertyValue('--event-y')).toBe('50px');
      expect(style.getPropertyValue('--event-width')).toBe('200px');
      expect(style.getPropertyValue('--event-height')).toBe('24px');
    });

    it('should apply color scheme', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot') as HTMLElement;

      expect(slot.style.getPropertyValue('--event-color')).toBe('#e91e63');
      expect(slot.style.getPropertyValue('--event-hover-color')).toBe('#c2185b');
      expect(slot.style.getPropertyValue('--event-text-color')).toBe('#ffffff');
    });
  });

  describe('Multiple Slots', () => {
    it('should render multiple slots', () => {
      const slot2 = { ...mockSlot };
      fixture.componentRef.setInput('slots', [mockSlot, slot2]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const slots = compiled.querySelectorAll('.group-slot');

      expect(slots.length).toBe(2);
    });
  });

  describe('Continuation Indicators', () => {
    it('should show continuation-left when not start', () => {
      const slotNotStart: GroupSlot = {
        ...mockSlot,
        renderData: { ...mockSlot.renderData, isStart: false }
      };

      fixture.componentRef.setInput('slots', [slotNotStart]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot');

      expect(slot?.classList.contains('has-continuation-left')).toBe(true);
    });

    it('should show continuation-right when not end', () => {
      const slotNotEnd: GroupSlot = {
        ...mockSlot,
        renderData: { ...mockSlot.renderData, isEnd: false }
      };

      fixture.componentRef.setInput('slots', [slotNotEnd]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot');

      expect(slot?.classList.contains('has-continuation-right')).toBe(true);
    });

    it('should not show indicators for complete event', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot');

      expect(slot?.classList.contains('has-continuation-left')).toBe(false);
      expect(slot?.classList.contains('has-continuation-right')).toBe(false);
    });
  });

  describe('Hover State', () => {
    it('should apply is-hovered class when hovered', () => {
      fixture.componentRef.setInput('isHovered', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot');

      expect(slot?.classList.contains('is-hovered')).toBe(true);
    });

    it('should emit slotHover on mouse enter', () => {
      let hoverState: boolean | undefined;
      component.slotHover.subscribe(state => hoverState = state);

      component.onMouseEnter();

      expect(hoverState).toBe(true);
    });

    it('should emit slotHover on mouse leave', () => {
      let hoverState: boolean | undefined;
      component.slotHover.subscribe(state => hoverState = state);

      component.onMouseLeave();

      expect(hoverState).toBe(false);
    });
  });

  describe('Selection State', () => {
    it('should apply is-selected class when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const slot = compiled.querySelector('.group-slot');

      expect(slot?.classList.contains('is-selected')).toBe(true);
    });
  });

  describe('Click Handling', () => {
    it('should emit slotClick on click', () => {
      let clicked = false;
      component.slotClick.subscribe(() => clicked = true);

      component.onClick(new MouseEvent('click'));

      expect(clicked).toBe(true);
    });

    it('should stop event propagation on click', () => {
      const event = new MouseEvent('click');
      const stopPropSpy = jest.spyOn(event, 'stopPropagation');

      component.onClick(event);

      expect(stopPropSpy).toHaveBeenCalled();
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly', () => {
      const formattedTime = component.formatTime(mockEvent);

      expect(formattedTime).toContain('10:00 AM');
      expect(formattedTime).toContain('11:00 AM');
    });

    it('should return empty string for non-event types', () => {
      const allDayEvent = {
        id: 'evt-2',
        title: 'All Day',
        type: 'all-day' as const,
        date: new Date(2024, 0, 15)
      };

      const formattedTime = component.formatTime(allDayEvent);
      expect(formattedTime).toBe('');
    });
  });
});
