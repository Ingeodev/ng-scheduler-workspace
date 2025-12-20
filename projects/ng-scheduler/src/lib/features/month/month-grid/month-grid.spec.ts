import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthGrid } from './month-grid';

describe('MonthGrid', () => {
  let component: MonthGrid;
  let fixture: ComponentFixture<MonthGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
