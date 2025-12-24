import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceItemSchedule } from './resource-item-schedule';
import { ResourceModel } from '../../../core/models/resource';

describe('ResourceItemSchedule', () => {
  let component: ResourceItemSchedule;
  let fixture: ComponentFixture<ResourceItemSchedule>;

  const mockResource: ResourceModel = {
    id: 'test-resource',
    name: 'Test Resource',
    color: '#4285f4',
    avatar: 'https://example.com/avatar.png',
    isActive: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceItemSchedule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResourceItemSchedule);
    component = fixture.componentInstance;

    // Provide required resource input
    fixture.componentRef.setInput('resource', mockResource);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display resource name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.resource-name');
    expect(nameElement?.textContent?.trim()).toBe('Test Resource');
  });

  it('should emit toggle event when clicked', () => {
    let emittedId: string | undefined;
    component.toggle.subscribe((id: string) => {
      emittedId = id;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const itemElement = compiled.querySelector('.resource-item') as HTMLElement;
    itemElement.click();

    expect(emittedId).toBe('test-resource');
  });

  it('should apply inactive class when resource is inactive', () => {
    const inactiveResource: ResourceModel = {
      ...mockResource,
      isActive: false
    };

    fixture.componentRef.setInput('resource', inactiveResource);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.resource-name');
    expect(nameElement?.classList.contains('inactive')).toBe(true);
  });

  it('should not apply inactive class when resource is active', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.resource-name');
    expect(nameElement?.classList.contains('inactive')).toBe(false);
  });
});
