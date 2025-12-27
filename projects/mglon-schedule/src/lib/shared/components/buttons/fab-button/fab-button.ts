import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button[mglon-fab-button], a[mglon-fab-button]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrl: './fab-button.scss',
  host: {
    '[class]': 'classes()',
    '[attr.data-size]': 'size()'
  }
})
export class FabButtonComponent {
  readonly size = input<'md' | 'lg'>('lg');
  readonly color = input<'primary' | 'secondary' | 'surface'>('surface');

  // Optional: extended FAB (with text) vs standard (icon only) could be handled via CSS classes check or another input
  readonly extended = input<boolean>(false);

  classes = computed(() => {
    return [
      'mglon-fab-button',
      `size-${this.size()}`,
      `color-${this.color()}`,
      this.extended() ? 'extended' : ''
    ].join(' ');
  });
}
