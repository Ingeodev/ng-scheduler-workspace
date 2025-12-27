import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceEvents } from './resource-events';
import { CalendarStore } from '../../core/store/calendar.store';
import { signal } from '@angular/core';

describe('ResourceEvents', () => {
  let component: ResourceEvents;
  let fixture: ComponentFixture<ResourceEvents>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      registerResource: jest.fn(),
      unregisterResource: jest.fn(),
      showResource: jest.fn(),
      hideResource: jest.fn(),
      resources: signal(new Map())
    };

    await TestBed.configureTestingModule({
      imports: [ResourceEvents],
      providers: [
        { provide: CalendarStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceEvents);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('id', 'resource-1');
    fixture.componentRef.setInput('name', 'Resource 1');
    fixture.componentRef.setInput('isActive', true);

    await fixture.whenStable();
  });

  it('should create and register resource on init', () => {
    component.ngOnInit();
    expect(mockStore.registerResource).toHaveBeenCalledWith(expect.objectContaining({
      id: 'resource-1',
      name: 'Resource 1'
    }));
  });

  it('should unregister resource on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.unregisterResource).toHaveBeenCalledWith('resource-1');
  });

  it('should sync isActive changes to store', () => {
    // Component effect will handle this, but we can call it manually/trigger change
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();
    // Effects are handled by Angular, might need to wait or trigger manually if using traditional effects
    // but here it's an inline effect in constructor
    expect(mockStore.hideResource).toHaveBeenCalledWith('resource-1');

    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();
    expect(mockStore.showResource).toHaveBeenCalledWith('resource-1');
  });
});
