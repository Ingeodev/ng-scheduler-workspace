import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventRenderComponent } from './event-render';
import { Event } from '../../../core/models/event';
import { EventRenderData } from '../../../core/rendering/event-renderer';

describe('EventRenderComponent', () => {
  let component: EventRenderComponent;
  let fixture: ComponentFixture<EventRenderComponent>;

  const mockEvent: Event = {
    id: 'evt-1',
    title: 'Test Event',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
    color: '#0860c4',
    type: 'event'
  };

  const mockRenderData: EventRenderData = {
    position: {
      top: 100,
      left: 50,
      width: 200,
      height: 60
    },
    zIndex: 1,
    layout: {
      column: 0,
      overlap: 0,
      totalOverlaps: 1
    },
    isDragging: false,
    isResizing: false,
    isHovered: false,
    isSelected: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRenderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventRenderComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('renderData', mockRenderData);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.event-render__title');

    expect(title?.textContent).toContain('Test Event');
  });

  it('should format and display event time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const time = compiled.querySelector('.event-render__time');

    expect(time?.textContent).toContain('AM');
  });

  it('should apply correct positioning styles', () => {
    const styles = component.eventStyles();

    expect(styles['--event-x']).toBe('50px');
    expect(styles['--event-y']).toBe('100px');
    expect(styles['--event-width']).toBe('200px');
    expect(styles['--event-height']).toBe('60px');
  });

  it('should use event color for background', () => {
    const styles = component.eventStyles();

    expect(styles['background-color']).toBe('#0860c4');
  });

  it('should emit event on click', () => {
    let clickedEvent: Event | undefined;
    component.eventClicked.subscribe(event => clickedEvent = event);

    const compiled = fixture.nativeElement as HTMLElement;
    const eventElement = compiled.querySelector('.event-render') as HTMLElement;
    eventElement.click();

    expect(clickedEvent).toEqual(mockEvent);
  });

  it('should set hovered state on mouse enter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const eventElement = compiled.querySelector('.event-render') as HTMLElement;

    eventElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(component.isHovered()).toBe(true);
  });

  it('should clear hovered state on mouse leave', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const eventElement = compiled.querySelector('.event-render') as HTMLElement;

    eventElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(component.isHovered()).toBe(true);

    eventElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(component.isHovered()).toBe(false);
  });

  it('should support manual selection', () => {
    component.select();
    expect(component.isSelected()).toBe(true);

    component.deselect();
    expect(component.isSelected()).toBe(false);
  });

  it('should hide continuation indicators for single-day events', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const leftIndicator = compiled.querySelector('.event-render__continue-left');
    const rightIndicator = compiled.querySelector('.event-render__continue-right');

    expect(leftIndicator).toBeNull();
    expect(rightIndicator).toBeNull();
  });

  it('should show left indicator when not start of multi-day event', () => {
    fixture.componentRef.setInput('isStart', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const leftIndicator = compiled.querySelector('.event-render__continue-left');

    expect(leftIndicator).toBeTruthy();
  });

  it('should show right indicator when not end of multi-day event', () => {
    fixture.componentRef.setInput('isEnd', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rightIndicator = compiled.querySelector('.event-render__continue-right');

    expect(rightIndicator).toBeTruthy();
  });
});
