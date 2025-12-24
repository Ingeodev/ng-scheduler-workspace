import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupSlotComponent } from './group-slot';
import { GroupSlot, SlotComponent } from '../slot/slot';
import { Event } from '../../../core/models/event';
import { By } from '@angular/platform-browser';

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
    it('should render mglon-slot components', () => {
      const slots = fixture.debugElement.queryAll(By.css('mglon-slot'));
      expect(slots.length).toBe(1);
    });

    it('should render multiple slots', () => {
      const slot2 = { ...mockSlot };
      fixture.componentRef.setInput('slots', [mockSlot, slot2]);
      fixture.detectChanges();

      const slots = fixture.debugElement.queryAll(By.css('mglon-slot'));
      expect(slots.length).toBe(2);
    });
  });

  describe('Output Propagation', () => {
    it('should propagate slotHover event', () => {
      let emitted = false;
      component.slotHover.subscribe((val) => emitted = val);

      // Simulate output from child
      component.onSlotHover(true);
      expect(emitted).toBe(true);

      component.onSlotHover(false);
      expect(emitted).toBe(false);
    });

    it('should propagate slotClick event', () => {
      let clicked = false;
      component.slotClick.subscribe(() => clicked = true);

      // Simulate output from child
      component.onSlotClick();
      expect(clicked).toBe(true);
    });
  });
});
