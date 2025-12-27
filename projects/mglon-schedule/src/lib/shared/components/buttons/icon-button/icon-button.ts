import { Component, input, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSize, ButtonColor, ButtonRadius } from '../button/button';

export type IconButtonAppereance = 'solid' | 'outline' | 'ghost';

@Component({
  selector: 'button[mglon-icon-button], a[mglon-icon-button]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrl: './icon-button.scss',
  host: {
    '[attr.appereance]': 'appereance()',
    '[attr.color]': 'color()',
    '[attr.size]': 'size()',
    '[attr.rounded]': 'rounded()',
    '[attr.active]': 'active() || null',
    '[attr.disabled]': 'disabled() || null'
  }
})
export class IconButtonComponent {
  readonly appereance = input<IconButtonAppereance>('ghost');
  readonly color = input<ButtonColor>('primary');
  readonly size = input<ButtonSize>('md');
  readonly rounded = input<ButtonRadius>('md');
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  public elementRef = inject(ElementRef);
}
