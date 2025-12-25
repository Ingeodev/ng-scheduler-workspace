import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSlot } from './month-slot';

describe('MonthSlot', () => {
  let component: MonthSlot;
  let fixture: ComponentFixture<MonthSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthSlot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
