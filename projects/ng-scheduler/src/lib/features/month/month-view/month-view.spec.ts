import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthView } from './month-view';

describe('MonthViewComponent', () => {
  let component: MonthView;
  let fixture: ComponentFixture<MonthView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthView]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonthView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
