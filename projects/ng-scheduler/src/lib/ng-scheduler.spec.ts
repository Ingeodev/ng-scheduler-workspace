import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgScheduler } from './ng-scheduler';

describe('NgScheduler', () => {
  let component: NgScheduler;
  let fixture: ComponentFixture<NgScheduler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScheduler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgScheduler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
