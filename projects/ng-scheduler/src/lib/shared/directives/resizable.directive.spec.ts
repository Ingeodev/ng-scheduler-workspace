import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableDirective, ResizeEvent } from './resizable.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div [mglonResizable]="sides" [resizeHandleSize]="handleSize" (resized)="onResized($event)" style="width: 100px; height: 100px; position: relative"></div>
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
      imports: [TestComponent, ResizableDirective]
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

    // Simulate click on left edge (handle size 10)
    // Client (0,0) relative to element (0,0) -> Inside 10px handle
    const event = new MouseEvent('mousedown', {
      clientX: 0,
      clientY: 50,
      bubbles: true
    });

    // Mock getBoundingClientRect for accurate coord check in tests
    jest.spyOn(div, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100
    } as DOMRect);

    div.dispatchEvent(event);

    expect(component.lastEvent).toBeTruthy();
    expect(component.lastEvent?.side).toBe('left');
  });

  it('should NOT emit resized event when clicking outside handle area', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;

    // Simulate click in middle (x=50)
    const event = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true
    });

    jest.spyOn(div, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100
    } as DOMRect);

    div.dispatchEvent(event);

    expect(component.lastEvent).toBeNull();
  });
});
