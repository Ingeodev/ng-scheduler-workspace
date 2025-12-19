import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSchedule } from './header-schedule';

describe('HeaderSchedule', () => {
  let component: HeaderSchedule;
  let fixture: ComponentFixture<HeaderSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
