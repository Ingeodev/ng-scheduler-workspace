import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDayEvent } from './all-day-event';

describe('AllDayEvent', () => {
  let component: AllDayEvent;
  let fixture: ComponentFixture<AllDayEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDayEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDayEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
