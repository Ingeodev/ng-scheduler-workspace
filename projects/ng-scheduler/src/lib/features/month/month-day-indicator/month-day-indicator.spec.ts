import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDayIndicator } from './month-day-indicator';

describe('MonthDayIndicator', () => {
  let component: MonthDayIndicator;
  let fixture: ComponentFixture<MonthDayIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthDayIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthDayIndicator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
