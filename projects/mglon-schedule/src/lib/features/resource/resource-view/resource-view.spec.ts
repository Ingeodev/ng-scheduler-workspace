import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceView } from './resource-view';

describe('ResourceView', () => {
  let component: ResourceView;
  let fixture: ComponentFixture<ResourceView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
