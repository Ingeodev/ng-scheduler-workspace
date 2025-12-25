import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWeek } from './month-week';

describe('MonthWeek', () => {
  let component: MonthWeek;
  let fixture: ComponentFixture<MonthWeek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthWeek]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthWeek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
