import { Component, input, computed, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSize } from '../button/button';

@Component({
  selector: 'button[mglon-icon-button], a[mglon-icon-button]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrl: './icon-button.scss',
  host: {
    '[class]': 'classes()',
    '[attr.data-size]': 'size()'
  }
})
export class IconButtonComponent {
  readonly size = input<ButtonSize>('md');
  readonly active = input<boolean>(false);

  public elementRef = inject(ElementRef);

  classes = computed(() => {
    return [
      'mglon-icon-button',
      `size-${this.size()}`,
      this.active() ? 'active' : ''
    ].join(' ');
  });
}
