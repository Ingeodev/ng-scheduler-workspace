import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWeekEventsContainer } from './month-week-events-container';

describe('MonthWeekEventsContainer', () => {
  let component: MonthWeekEventsContainer;
  let fixture: ComponentFixture<MonthWeekEventsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWeekEventsContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthWeekEventsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
