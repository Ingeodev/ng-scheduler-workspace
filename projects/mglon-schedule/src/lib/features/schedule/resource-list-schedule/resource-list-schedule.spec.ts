import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceListSchedule } from './resource-list-schedule';

describe('ResourceListSchedule', () => {
  let component: ResourceListSchedule;
  let fixture: ComponentFixture<ResourceListSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceListSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceListSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
