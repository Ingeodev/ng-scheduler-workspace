import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthHeader } from './month-header';

describe('MonthHeader', () => {
  let component: MonthHeader;
  let fixture: ComponentFixture<MonthHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
