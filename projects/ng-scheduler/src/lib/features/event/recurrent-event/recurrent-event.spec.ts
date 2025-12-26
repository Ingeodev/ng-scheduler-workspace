import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentEvent } from './recurrent-event';

describe('RecurrentEvent', () => {
  let component: RecurrentEvent;
  let fixture: ComponentFixture<RecurrentEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrentEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurrentEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
