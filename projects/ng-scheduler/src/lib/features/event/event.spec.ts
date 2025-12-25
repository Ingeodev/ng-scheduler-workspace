import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event } from './event';
import { CalendarStore } from '../../core/store/calendar.store';
import { RESOURCE_ID_TOKEN } from '../resource-events/resource-events';
import { signal } from '@angular/core';

describe('Event Component', () => {
  let component: Event;
  let fixture: ComponentFixture<Event>;
  let mockStore: any;

  const eventData = {
    id: 'event-1',
    title: 'Test Event',
    startDate: new Date('2025-12-24T10:00:00'),
    endDate: new Date('2025-12-24T11:00:00')
  };

  beforeEach(async () => {
    mockStore = {
      registerEvent: jest.fn(),
      unregisterEvent: jest.fn()
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
});
