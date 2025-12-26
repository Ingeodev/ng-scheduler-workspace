import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event } from './event';
import { CalendarStore } from '../../core/store/calendar.store';
import { RESOURCE_ID_TOKEN } from '../resource-events/resource-events';
import { Subject } from 'rxjs';
import { InteractionEvent, InteractionType } from '../../core/models/interaction.model';

describe('Event Component', () => {
  let component: Event;
  let fixture: ComponentFixture<Event>;
  let mockStore: any;
  let interaction$: Subject<InteractionEvent>;

  const eventData: any = {
    id: 'event-1',
    title: 'Test Event',
    startDate: new Date('2025-12-24T10:00:00'),
    endDate: new Date('2025-12-24T11:00:00'),
    start: new Date('2025-12-24T10:00:00'),
    end: new Date('2025-12-24T11:00:00'),
    type: 'event'
  };

  beforeEach(async () => {
    interaction$ = new Subject<InteractionEvent>();
    mockStore = {
      registerEvent: jest.fn(),
      unregisterEvent: jest.fn(),
      getInteractions: jest.fn().mockReturnValue(interaction$.asObservable())
    };

    await TestBed.configureTestingModule({
      imports: [Event],
      providers: [
        { provide: CalendarStore, useValue: mockStore },
        { provide: RESOURCE_ID_TOKEN, useValue: 'parent-resource-id' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Event);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('id', eventData.id);
    fixture.componentRef.setInput('title', eventData.title);
    fixture.componentRef.setInput('startDate', eventData.startDate);
    fixture.componentRef.setInput('endDate', eventData.endDate);

    await fixture.whenStable();
  });

  it('should create and register event on init with parent resource id', () => {
    component.ngOnInit();
    expect(mockStore.registerEvent).toHaveBeenCalledWith(expect.objectContaining({
      id: eventData.id,
      title: eventData.title,
      resourceId: 'parent-resource-id',
      type: 'event'
    }));
  });

  it('should unregister event on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.unregisterEvent).toHaveBeenCalledWith(eventData.id);
  });

  it('should prioritize explicit resourceId over parent resource id', () => {
    fixture.componentRef.setInput('resourceId', 'explicit-resource-id');
    component.ngOnInit();
    expect(mockStore.registerEvent).toHaveBeenCalledWith(expect.objectContaining({
      resourceId: 'explicit-resource-id'
    }));
  });

  describe('Interaction Outputs', () => {
    const interactionTypes: { type: InteractionType; output: string }[] = [
      { type: 'click', output: 'eventClick' },
      { type: 'dblclick', output: 'eventDblClick' },
      { type: 'contextmenu', output: 'eventContextMenu' },
      { type: 'mouseenter', output: 'eventMouseEnter' },
      { type: 'mouseleave', output: 'eventMouseLeave' },
      { type: 'resizeStart', output: 'eventResizeStart' },
      { type: 'resize', output: 'eventResize' },
      { type: 'resizeEnd', output: 'eventResizeEnd' },
      { type: 'dragStart', output: 'eventDragStart' },
      { type: 'drag', output: 'eventDrag' },
      { type: 'dragEnd', output: 'eventDragEnd' },
    ];

    interactionTypes.forEach(({ type, output }) => {
      it(`should emit ${output} when store dispatches ${type}`, (done) => {
        const payload: any = { event: eventData, slotId: 'slot-1' };
        const outputEmitter = component[output as keyof Event] as any;

        outputEmitter.subscribe((emitted: any) => {
          expect(emitted).toEqual(payload);
          done();
        });

        interaction$.next({ type, eventId: eventData.id, payload });
      });
    });

    it('should NOT emit if interaction eventId does not match component id', () => {
      const spy = jest.spyOn(component.eventClick, 'emit');
      interaction$.next({
        type: 'click',
        eventId: 'other-id',
        payload: { event: eventData, slotId: 'slot-1' } as any
      });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
