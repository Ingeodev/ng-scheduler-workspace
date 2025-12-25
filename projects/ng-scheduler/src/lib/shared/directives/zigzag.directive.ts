import { Directive, input, computed, effect, ElementRef, Renderer2, inject } from '@angular/core';

export type ZigzagSide = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[mglonZigzag]',
  standalone: true,
  host: {
    '[style.--mglon-zigzag-size]': 'zigzagSize()'
  }
})
export class ZigzagDirective {
  /**
   * Side(s) to apply the zigzag effect to.
   * Can be a single side string or an array of sides.
   */
  readonly sides = input.required<ZigzagSide | ZigzagSide[] | '' | null | undefined>({ alias: 'mglonZigzag' });

  /**
   * Size of the zigzag teeth (e.g., '10px', '0.5em').
   * Defaults to '5px' if not specified.
   */
  readonly zigzagSize = input<string>('5px');

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const sidesInput = this.sides();
      const sides = Array.isArray(sidesInput) ? sidesInput : [sidesInput];

      // Clear all existing zigzag classes first
      const allSides: ZigzagSide[] = ['top', 'right', 'bottom', 'left'];
      allSides.forEach(side => {
        this.renderer.removeClass(this.elementRef.nativeElement, `mglon-zigzag-${side}`);
      });

      // Apply classes for requested sides
      sides.forEach(side => {
        if (side && allSides.includes(side as ZigzagSide)) {
          this.renderer.addClass(this.elementRef.nativeElement, `mglon-zigzag-${side}`);
        }
      });
    });
  }
}
