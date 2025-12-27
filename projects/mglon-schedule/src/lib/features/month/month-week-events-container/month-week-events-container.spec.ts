import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWeekEventsContainer } from './month-week-events-container';
import { SlotModel } from '../../../core/models/slot.model';

describe('MonthWeekEventsContainer', () => {
  let component: MonthWeekEventsContainer;
  let fixture: ComponentFixture<MonthWeekEventsContainer>;

  const mockSlots: SlotModel[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWeekEventsContainer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthWeekEventsContainer);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('slots', mockSlots);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept slots input', () => {
    expect(component.slots()).toEqual([]);
  });
});
