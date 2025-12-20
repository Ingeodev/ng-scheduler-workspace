import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventComponent } from './event';
import { EventStore } from '../../../core/store/event.store';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let store: InstanceType<typeof EventStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(EventStore);
  });

  afterEach(() => {
    store.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register event on init', () => {
    fixture.componentRef.setInput('id', 'evt-1');
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('start', new Date(2024, 0, 1, 10, 0));
    fixture.componentRef.setInput('end', new Date(2024, 0, 1, 11, 0));

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getEvent('evt-1');
    expect(registered).toBeDefined();
    expect(registered?.title).toBe('Test Event');
    expect(registered?.type).toBe('event');
  });

  it('should unregister event on destroy', () => {
    fixture.componentRef.setInput('id', 'evt-1');
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('start', new Date(2024, 0, 1, 10, 0));
    fixture.componentRef.setInput('end', new Date(2024, 0, 1, 11, 0));

    fixture.detectChanges();
    component.ngOnInit();

    expect(store.getEvent('evt-1')).toBeDefined();

    component.ngOnDestroy();

    expect(store.getEvent('evt-1')).toBeUndefined();
  });

  it('should register event with optional properties', () => {
    fixture.componentRef.setInput('id', 'evt-1');
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('start', new Date(2024, 0, 1, 10, 0));
    fixture.componentRef.setInput('end', new Date(2024, 0, 1, 11, 0));
    fixture.componentRef.setInput('resourceId', 'res-1');
    fixture.componentRef.setInput('color', '#0860c4');
    fixture.componentRef.setInput('description', 'Test description');
    fixture.componentRef.setInput('tags', ['important', 'meeting']);

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getEvent('evt-1');
    expect(registered?.resourceId).toBe('res-1');
    expect(registered?.color).toBe('#0860c4');
    expect(registered?.description).toBe('Test description');
    expect(registered?.tags).toEqual(['important', 'meeting']);
  });

  it('should register event with readonly and blocked flags', () => {
    fixture.componentRef.setInput('id', 'evt-1');
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('start', new Date(2024, 0, 1, 10, 0));
    fixture.componentRef.setInput('end', new Date(2024, 0, 1, 11, 0));
    fixture.componentRef.setInput('isReadOnly', true);
    fixture.componentRef.setInput('isBlocked', true);

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getEvent('evt-1');
    expect(registered?.isReadOnly).toBe(true);
    expect(registered?.isBlocked).toBe(true);
  });

  it('should register event with metadata', () => {
    const metadata = { customField: 'value', priority: 'high' };

    fixture.componentRef.setInput('id', 'evt-1');
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('start', new Date(2024, 0, 1, 10, 0));
    fixture.componentRef.setInput('end', new Date(2024, 0, 1, 11, 0));
    fixture.componentRef.setInput('metadata', metadata);

    fixture.detectChanges();
    component.ngOnInit();

    const registered = store.getEvent('evt-1');
    expect(registered?.metadata).toEqual(metadata);
  });
});
