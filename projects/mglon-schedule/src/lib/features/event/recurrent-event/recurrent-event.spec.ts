import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentEvent } from './recurrent-event';
import { CalendarStore } from '../../../core/store/calendar.store';

describe('RecurrentEvent', () => {
  let component: RecurrentEvent;
  let fixture: ComponentFixture<RecurrentEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrentEvent],
      providers: [CalendarStore]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecurrentEvent);
    component = fixture.componentInstance;

    // Set all required inputs using proper recurrence rule format
    fixture.componentRef.setInput('id', 'test-recurrent-1');
    fixture.componentRef.setInput('title', 'Test Recurrent Event');
    fixture.componentRef.setInput('startDate', new Date(2024, 0, 15, 9, 0));
    fixture.componentRef.setInput('endDate', new Date(2024, 0, 15, 10, 0));
    fixture.componentRef.setInput('recurrenceRule', {
      type: 'daily',
      interval: 1,
      count: 5
    });

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct id', () => {
    expect(component.id()).toBe('test-recurrent-1');
  });
});
