import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCell } from './month-cell';
import { CalendarDay } from '../../../shared/helpers';

describe('MonthCell', () => {
  let component: MonthCell;
  let fixture: ComponentFixture<MonthCell>;

  const mockDay: CalendarDay = {
    date: new Date(2024, 0, 15),
    day: 15,
    isCurrentMonth: true,
    isPreviousMonth: false,
    isNextMonth: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthCell]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthCell);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('day', mockDay);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display day number', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('15');
  });

  it('should have current month class when isCurrentMonth is true', () => {
    const cellDiv = fixture.nativeElement.querySelector('.mglon-month-cell');
    expect(cellDiv.classList.contains('mglon-month-cell--current-month')).toBe(true);
  });

  it('should not have current month class when isCurrentMonth is false', () => {
    const otherMonthDay: CalendarDay = {
      ...mockDay,
      isCurrentMonth: false,
      isPreviousMonth: true
    };

    fixture.componentRef.setInput('day', otherMonthDay);
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('.mglon-month-cell');
    expect(cellDiv.classList.contains('mglon-month-cell--current-month')).toBe(false);
    expect(cellDiv.classList.contains('mglon-month-cell--other-month')).toBe(true);
  });
});
