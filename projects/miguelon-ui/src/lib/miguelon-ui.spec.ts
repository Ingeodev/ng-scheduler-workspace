import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiguelonUi } from './miguelon-ui';

describe('MiguelonUi', () => {
  let component: MiguelonUi;
  let fixture: ComponentFixture<MiguelonUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiguelonUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiguelonUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
