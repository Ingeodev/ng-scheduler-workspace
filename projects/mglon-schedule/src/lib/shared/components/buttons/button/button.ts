import { Component, input, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonAppereance = 'solid' | 'outline' | 'ghost' | 'link';
export type ButtonColor = 'primary' | 'secondary' | 'error';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'button[mglon-button], a[mglon-button]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrl: './button.scss',
  host: {
    '[attr.appereance]': 'appereance()',
    '[attr.color]': 'color()',
    '[attr.size]': 'size()',
    '[attr.rounded]': 'rounded()',
    '[attr.density]': 'density()',
    '[attr.active]': 'active() || null',
    '[attr.disabled]': 'disabled() || null'
  }
})
export class ButtonComponent {
  readonly appereance = input<ButtonAppereance>('solid');
  readonly color = input<ButtonColor>('primary');
  readonly size = input<ButtonSize>('md');
  readonly rounded = input<ButtonRadius>('md');
  readonly density = input<'compact' | 'comfortable'>('comfortable');
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  public elementRef = inject(ElementRef);
}
