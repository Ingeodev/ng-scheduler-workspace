import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableDirective, ResizeEvent } from './resizable.directive';
import { By } from '@angular/platform-browser';
import { CalendarStore } from '../../core/store/calendar.store';

@Component({
  template: `
    <div [mglonResizable]="sides" [resizeHandleSize]="handleSize" (resizeStart)="onResized($event)" style="width: 100px; height: 100px; position: relative"></div>
  `,
  imports: [ResizableDirective],
  standalone: true
})
class TestComponent {
  sides: string | string[] = 'left';
  handleSize = 10;
  lastEvent: ResizeEvent | null = null;

  onResized(e: ResizeEvent) {
    this.lastEvent = e;
  }
}

describe('ResizableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ResizableDirective],
      providers: [CalendarStore]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply class for single side', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.classList).toContain('mglon-resizable-left');
  });

  it('should emit resized event when clicking handle area', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;

    // Mock getBoundingClientRect for accurate coord check in tests
    jest.spyOn(div, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => { }
    } as DOMRect);

    // First trigger mouseenter to register the mousedown listener
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
    div.dispatchEvent(mouseEnterEvent);

    // Now simulate click on left edge (handle size 10)
    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: 5, // Within 10px handle
      clientY: 50,
      bubbles: true
    });

    div.dispatchEvent(mouseDownEvent);

    expect(component.lastEvent).toBeTruthy();
    expect(component.lastEvent?.side).toBe('left');
  });

  it('should NOT emit resized event when clicking outside handle area', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;

    jest.spyOn(div, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => { }
    } as DOMRect);

    // Trigger mouseenter first
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
    div.dispatchEvent(mouseEnterEvent);

    // Simulate click in middle (x=50)
    const event = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true
    });

    div.dispatchEvent(event);

    expect(component.lastEvent).toBeNull();
  });
});
