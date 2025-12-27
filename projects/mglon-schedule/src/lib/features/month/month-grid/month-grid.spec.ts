import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthGrid } from './month-grid';
import { CalendarStore } from '../../../core/store/calendar.store';

describe('MonthGrid', () => {
  let component: MonthGrid;
  let fixture: ComponentFixture<MonthGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthGrid],
      providers: [CalendarStore]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
