import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDayIndicator } from './month-day-indicator';
import { CalendarDay } from '../../../shared/helpers';

describe('MonthDayIndicator', () => {
  let component: MonthDayIndicator;
  let fixture: ComponentFixture<MonthDayIndicator>;

  const mockDay: CalendarDay = {
    date: new Date(2024, 0, 15),
    day: 15,
    isCurrentMonth: true,
    isPreviousMonth: false,
    isNextMonth: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthDayIndicator]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthDayIndicator);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('day', mockDay);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the day number', () => {
    expect(component.day().day).toBe(15);
  });
});
