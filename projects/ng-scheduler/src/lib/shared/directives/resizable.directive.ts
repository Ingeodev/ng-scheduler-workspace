import { Directive, input, output, effect, ElementRef, Renderer2, inject, HostListener, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ResizeSide = 'top' | 'right' | 'bottom' | 'left';
export interface ResizeEvent {
  side: ResizeSide;
  event: MouseEvent;
}

@Directive({
  selector: '[mglonResizable]',
  standalone: true,
  host: {
    '[style.--mglon-resize-handle-size]': 'handleSize() + "px"'
  }
})
export class ResizableDirective implements OnDestroy {
  /**
   * Sides to allow resizing on.
   */
  readonly sides = input.required<ResizeSide | ResizeSide[] | '' | null | undefined>({ alias: 'mglonResizable' });

  /**
   * Size of the resize handle area in pixels.
   */
  readonly handleSize = input<number>(6);

  /**
   * Emitted when a resize interaction starts (mousedown on handle).
   */
  readonly resizeStart = output<ResizeEvent>();

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  private destroyMouseDownListener?: () => void;

  constructor() {
    effect(() => {
      const sidesInput = this.sides();
      const sides = Array.isArray(sidesInput) ? sidesInput : [sidesInput];

      const allSides: ResizeSide[] = ['top', 'right', 'bottom', 'left'];
      allSides.forEach(side => {
        this.renderer.removeClass(this.elementRef.nativeElement, `mglon-resizable-${side}`);
      });

      sides.forEach(side => {
        if (side && allSides.includes(side as ResizeSide)) {
          this.renderer.addClass(this.elementRef.nativeElement, `mglon-resizable-${side}`);
        }
      });
    });
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.destroyMouseDownListener) {
      return;
    }

    this.destroyMouseDownListener = this.renderer.listen(
      this.elementRef.nativeElement,
      'mousedown',
      (event: MouseEvent) => this.handleMouseDown(event)
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.destroyMouseDownListener) {
      this.destroyMouseDownListener();
      this.destroyMouseDownListener = undefined;
    }
  }

  ngOnDestroy() {
    this.cleanupListeners();
  }

  private cleanupListeners() {
    if (this.destroyMouseDownListener) {
      this.destroyMouseDownListener();
      this.destroyMouseDownListener = undefined;
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const sidesInput = this.sides();
    const activeSides = Array.isArray(sidesInput) ? sidesInput : [sidesInput];

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const handle = this.handleSize();

    let clickedSide: ResizeSide | null = null;

    if (activeSides.includes('left') && x <= handle) {
      clickedSide = 'left';
    } else if (activeSides.includes('right') && x >= w - handle) {
      clickedSide = 'right';
    } else if (activeSides.includes('top') && y <= handle) {
      clickedSide = 'top';
    } else if (activeSides.includes('bottom') && y >= h - handle) {
      clickedSide = 'bottom';
    }

    if (clickedSide) {
      event.preventDefault();
      event.stopPropagation();
      this.resizeStart.emit({ side: clickedSide, event });
    }
  }
}
