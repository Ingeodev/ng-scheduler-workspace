import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWeek } from './month-week';
import { CalendarDay, CalendarWeek } from '../../../shared/helpers';
import { CalendarStore } from '../../../core/store/calendar.store';

describe('MonthWeek', () => {
  let component: MonthWeek;
  let fixture: ComponentFixture<MonthWeek>;

  const mockDays: CalendarDay[] = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(2024, 0, 14 + i), // Jan 14-20, 2024
    day: 14 + i,
    isCurrentMonth: true,
    isPreviousMonth: false,
    isNextMonth: false
  }));

  const mockWeek: CalendarWeek = {
    days: mockDays
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWeek],
      providers: [CalendarStore]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthWeek);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('week', mockWeek);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 7 days in the week', () => {
    expect(component.week().days.length).toBe(7);
  });
});
