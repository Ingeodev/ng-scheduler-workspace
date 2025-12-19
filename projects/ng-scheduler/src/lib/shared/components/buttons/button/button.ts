import { Component, input, HostBinding, computed, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'tonal';
export type ButtonColor = 'primary' | 'secondary' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[mglon-button], a[mglon-button]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrl: './button.scss',
  host: {
    '[class]': 'classes()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'active()'
  }
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('filled');
  readonly color = input<ButtonColor>('primary');
  readonly size = input<ButtonSize>('md');
  readonly active = input<boolean>(false);

  public elementRef = inject(ElementRef);

  classes = computed(() => {
    return [
      'mglon-button',
      `variant-${this.variant()}`,
      `color-${this.color()}`,
      `size-${this.size()}`
    ].join(' ');
  });
}
