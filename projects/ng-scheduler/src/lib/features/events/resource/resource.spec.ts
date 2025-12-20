import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceComponent } from './resource';
import { EventStore } from '../../../core/store/event.store';

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
  let store: InstanceType<typeof EventStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(EventStore);
  });

  afterEach(() => {
    store.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register resource on init', () => {
    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getResource('res-1');
    expect(registered).toBeDefined();
    expect(registered?.name).toBe('Conference Room A');
  });

  it('should unregister resource on destroy', () => {
    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');

    fixture.detectChanges();
    component.ngOnInit();

    expect(store.getResource('res-1')).toBeDefined();

    component.ngOnDestroy();

    expect(store.getResource('res-1')).toBeUndefined();
  });

  it('should register resource with color', () => {
    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');
    fixture.componentRef.setInput('color', '#0860c4');

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getResource('res-1');
    expect(registered?.color).toBe('#0860c4');
  });

  it('should register resource with all optional properties', () => {
    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');
    fixture.componentRef.setInput('color', '#0860c4');
    fixture.componentRef.setInput('avatar', 'https://example.com/avatar.jpg');
    fixture.componentRef.setInput('description', 'Main conference room');
    fixture.componentRef.setInput('tags', ['large', 'projector']);
    fixture.componentRef.setInput('isReadOnly', true);
    fixture.componentRef.setInput('isBlocked', false);

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getResource('res-1');
    expect(registered?.avatar).toBe('https://example.com/avatar.jpg');
    expect(registered?.description).toBe('Main conference room');
    expect(registered?.tags).toEqual(['large', 'projector']);
    expect(registered?.isReadOnly).toBe(true);
    expect(registered?.isBlocked).toBe(false);
  });

  it('should register resource with metadata', () => {
    const metadata = { capacity: 20, floor: 3 };

    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');
    fixture.componentRef.setInput('metadata', metadata);

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getResource('res-1');
    expect(registered?.metadata).toEqual(metadata);
  });

  it('should render child content', () => {
    fixture.componentRef.setInput('id', 'res-1');
    fixture.componentRef.setInput('name', 'Conference Room A');

    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    // The component uses display: contents, so child content should be projected
    expect(compiled.querySelector('ng-content')).toBeDefined();
  });
});
