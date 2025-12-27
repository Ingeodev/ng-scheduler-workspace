import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectableDirective, SelectionResult } from './selectable.directive';
import { Selectable } from './selectable.abstract';

/**
 * Test host component that implements Selectable
 */
@Component({
  selector: 'test-host',
  standalone: true,
  imports: [SelectableDirective],
  template: `
    <div 
      [mglonSelectable]="this"
      (selectionStart)="onStart($event)"
      (selectionChange)="onChange($event)"
      (selectionEnd)="onEnd($event)"
      style="width: 500px; height: 500px; position: relative;">
    </div>
  `
})
class TestHostComponent implements Selectable {
  // Track emitted events
  startEvent = signal<SelectionResult | null>(null);
  changeEvent = signal<SelectionResult | null>(null);
  endEvent = signal<SelectionResult | null>(null);

  // Mock date to return
  mockDate = new Date(2024, 0, 15);

  getDateFromPoint(x: number, y: number): { date: Date; resourceId?: string } | null {
    // Return a date based on coordinates for testing
    return { date: this.mockDate };
  }

  onStart(event: SelectionResult): void {
    this.startEvent.set(event);
  }

  onChange(event: SelectionResult): void {
    this.changeEvent.set(event);
  }

  onEnd(event: SelectionResult): void {
    this.endEvent.set(event);
  }
}

describe('SelectableDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directiveElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
  });

  describe('Selection Lifecycle', () => {
    it('should emit selectionStart on mousedown', () => {
      const event = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      });

      directiveElement.dispatchEvent(event);
      fixture.detectChanges();

      const startEvent = component.startEvent();
      expect(startEvent).toBeTruthy();
      expect(startEvent?.start?.date).toEqual(component.mockDate);
      expect(startEvent?.end?.date).toEqual(component.mockDate);
    });

    it('should emit selectionChange on mousemove while selecting', () => {
      // Start selection
      const mousedown = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      });
      directiveElement.dispatchEvent(mousedown);

      // Move mouse
      const mousemove = new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      });
      directiveElement.dispatchEvent(mousemove);
      fixture.detectChanges();

      const changeEvent = component.changeEvent();
      expect(changeEvent).toBeTruthy();
      expect(changeEvent?.start?.date).toEqual(component.mockDate);
      expect(changeEvent?.end?.date).toEqual(component.mockDate);
    });

    it('should emit selectionEnd on mouseup', () => {
      // Start selection
      const mousedown = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      });
      directiveElement.dispatchEvent(mousedown);

      // End selection
      const mouseup = new MouseEvent('mouseup', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      });
      directiveElement.dispatchEvent(mouseup);
      fixture.detectChanges();

      const endEvent = component.endEvent();
      expect(endEvent).toBeTruthy();
      expect(endEvent?.start?.date).toEqual(component.mockDate);
      expect(endEvent?.end?.date).toEqual(component.mockDate);
    });

    it('should not emit selectionChange when not selecting', () => {
      // Move mouse without starting selection
      const mousemove = new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      });
      directiveElement.dispatchEvent(mousemove);
      fixture.detectChanges();

      expect(component.changeEvent()).toBeNull();
    });

    it('should clear selection after mouseup', () => {
      // Get directive instance
      const directive = fixture.debugElement.query(
        el => el.nativeElement === directiveElement
      )?.injector.get(SelectableDirective);

      // Start and end selection
      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      expect(directive?.isSelecting()).toBe(true);

      directiveElement.dispatchEvent(new MouseEvent('mouseup', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      }));

      expect(directive?.isSelecting()).toBe(false);
      expect(directive?.selection()).toBeNull();
    });
  });

  describe('Selection Rectangle Calculation', () => {
    it('should create selection rectangle from top-left to bottom-right', () => {
      const directive = fixture.debugElement.query(
        el => el.nativeElement === directiveElement
      )?.injector.get(SelectableDirective);

      // Start at (100, 100)
      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      // Move to (200, 200)
      directiveElement.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      }));

      const selection = directive?.selection();
      expect(selection).toBeTruthy();
      expect(selection!.left).toBeLessThan(selection!.right);
      expect(selection!.top).toBeLessThan(selection!.bottom);
    });

    it('should handle dragging from bottom-right to top-left', () => {
      const directive = fixture.debugElement.query(
        el => el.nativeElement === directiveElement
      )?.injector.get(SelectableDirective);

      // Start at (200, 200)
      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      }));

      // Move to (100, 100)
      directiveElement.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      const selection = directive?.selection();
      expect(selection).toBeTruthy();
      // Rectangle should still have left < right and top < bottom
      expect(selection!.left).toBeLessThan(selection!.right);
      expect(selection!.top).toBeLessThan(selection!.bottom);
    });

    it('should update selection rectangle on each mousemove', () => {
      const directive = fixture.debugElement.query(
        el => el.nativeElement === directiveElement
      )?.injector.get(SelectableDirective);

      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      // First move
      directiveElement.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 150,
        bubbles: true
      }));

      const selection1 = directive?.selection();
      const width1 = selection1!.right - selection1!.left;

      // Second move (further)
      directiveElement.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      }));

      const selection2 = directive?.selection();
      const width2 = selection2!.right - selection2!.left;

      expect(width2).toBeGreaterThan(width1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle getDateFromPoint returning null', () => {
      // Override to return null
      component.getDateFromPoint = () => null;

      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      const startEvent = component.startEvent();
      expect(startEvent?.start).toBeNull();
    });

    it('should handle rapid mouse movements', () => {
      directiveElement.dispatchEvent(new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      }));

      // Rapid movements
      for (let i = 0; i < 10; i++) {
        directiveElement.dispatchEvent(new MouseEvent('mousemove', {
          clientX: 100 + i * 10,
          clientY: 100 + i * 10,
          bubbles: true
        }));
      }

      // Should still work correctly
      const changeEvent = component.changeEvent();
      expect(changeEvent).toBeTruthy();
    });

    it('should handle mouseup without mousedown', () => {
      // This shouldn't throw an error
      expect(() => {
        directiveElement.dispatchEvent(new MouseEvent('mouseup', {
          clientX: 100,
          clientY: 100,
          bubbles: true
        }));
      }).not.toThrow();

      expect(component.endEvent()).toBeNull();
    });
  });
});
