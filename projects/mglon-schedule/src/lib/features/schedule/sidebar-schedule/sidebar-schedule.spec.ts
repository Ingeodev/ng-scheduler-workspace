import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSchedule } from './sidebar-schedule';

describe('SidebarSchedule', () => {
  let component: SidebarSchedule;
  let fixture: ComponentFixture<SidebarSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
