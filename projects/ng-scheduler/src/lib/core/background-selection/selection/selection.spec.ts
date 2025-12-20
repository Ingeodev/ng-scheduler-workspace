import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Selection, SelectionCorner } from './selection';

describe('Selection Component', () => {
  let component: Selection;
  let fixture: ComponentFixture<Selection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Selection]
    }).compileComponents();

    fixture = TestBed.createComponent(Selection);
    component = fixture.componentInstance;
  });

  describe('Visibility', () => {
    it('should hide indicator when not selecting', () => {
      fixture.componentRef.setInput('selection', { top: 10, left: 10, bottom: 100, right: 100 });
      fixture.componentRef.setInput('isSelecting', false);
      fixture.detectChanges();

      const style = component.indicatorStyle();
      expect(style.display).toBe('none');
    });

    it('should hide indicator when selection is null', () => {
      fixture.componentRef.setInput('selection', null);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();
      expect(style.display).toBe('none');
    });

    it('should show indicator when selecting and selection exists', () => {
      const selection: SelectionCorner = { top: 10, left: 10, bottom: 100, right: 100 };
      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();
      expect(style.display).toBe('block');
    });
  });

  describe('Style Calculation', () => {
    it('should calculate correct position and size', () => {
      const selection: SelectionCorner = {
        top: 50,
        left: 100,
        bottom: 200,
        right: 300
      };

      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();

      expect(style.top).toBe('50px');
      expect(style.left).toBe('100px');
      expect(style.width).toBe('200px'); // 300 - 100
      expect(style.height).toBe('150px'); // 200 - 50
    });

    it('should handle zero-size selection (single point)', () => {
      const selection: SelectionCorner = {
        top: 100,
        left: 100,
        bottom: 100,
        right: 100
      };

      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();

      expect(style.width).toBe('0px');
      expect(style.height).toBe('0px');
    });

    it('should handle small selections', () => {
      const selection: SelectionCorner = {
        top: 100,
        left: 100,
        bottom: 102,
        right: 102
      };

      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();

      expect(style.width).toBe('2px');
      expect(style.height).toBe('2px');
    });

    it('should handle large selections', () => {
      const selection: SelectionCorner = {
        top: 0,
        left: 0,
        bottom: 1000,
        right: 1000
      };

      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style = component.indicatorStyle();

      expect(style.width).toBe('1000px');
      expect(style.height).toBe('1000px');
    });
  });

  describe('Reactivity', () => {
    it('should update style when selection changes', () => {
      const selection1: SelectionCorner = { top: 10, left: 10, bottom: 50, right: 50 };
      fixture.componentRef.setInput('selection', selection1);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const style1 = component.indicatorStyle();
      expect(style1.width).toBe('40px');

      const selection2: SelectionCorner = { top: 10, left: 10, bottom: 100, right: 100 };
      fixture.componentRef.setInput('selection', selection2);
      fixture.detectChanges();

      const style2 = component.indicatorStyle();
      expect(style2.width).toBe('90px');
    });

    it('should update visibility when isSelecting changes', () => {
      const selection: SelectionCorner = { top: 10, left: 10, bottom: 100, right: 100 };
      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      expect(component.indicatorStyle().display).toBe('block');

      fixture.componentRef.setInput('isSelecting', false);
      fixture.detectChanges();

      expect(component.indicatorStyle().display).toBe('none');
    });
  });

  describe('Template Rendering', () => {
    it('should render indicator element', () => {
      fixture.detectChanges();
      const indicator = fixture.nativeElement.querySelector('.mglon-selection__indicator');
      expect(indicator).toBeTruthy();
    });

    it('should apply styles to indicator', () => {
      const selection: SelectionCorner = { top: 50, left: 100, bottom: 200, right: 300 };
      fixture.componentRef.setInput('selection', selection);
      fixture.componentRef.setInput('isSelecting', true);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('.mglon-selection__indicator') as HTMLElement;

      expect(indicator.style.top).toBe('50px');
      expect(indicator.style.left).toBe('100px');
      expect(indicator.style.width).toBe('200px');
      expect(indicator.style.height).toBe('150px');
      expect(indicator.style.display).toBe('block');
    });
  });
});
