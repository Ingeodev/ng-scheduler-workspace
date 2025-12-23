import { Component, input, contentChildren, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';
import { IconButtonComponent } from '../icon-button/icon-button';

export type ButtonGroupType = 'text' | 'icon' | 'icon-text';
export type ButtonGroupRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'mglon-button-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-group.html',
  styleUrl: './button-group.scss',
  host: {
    '[attr.role]': '"group"',
    '[attr.rounded]': 'rounded()',
    '[attr.type]': 'type()',
    '[attr.orientation]': 'orientation()',
    '[attr.appereance]': 'appereance()',
    '[attr.density]': 'density()',
    '[attr.disabled]': 'disabled() || null'
  }
})
export class ButtonGroupComponent {
  readonly type = input<ButtonGroupType>('text');
  readonly density = input<'compact' | 'comfortable'>('comfortable');
  readonly appereance = input<'solid' | 'outline' | 'ghost' | 'link'>('solid');
  readonly rounded = input<ButtonGroupRadius>('full');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly disabled = input<boolean>(false);

  // Queries for projected content
  readonly buttons = contentChildren(ButtonComponent);
  readonly iconButtons = contentChildren(IconButtonComponent);

  readonly indicatorStyle = signal<{ [key: string]: string }>({});

  constructor() {
    // Effect to update selection indicator position
    effect(() => {
      const allButtons = [...this.buttons(), ...this.iconButtons()];
      const activeButton = allButtons.find(btn => btn.active() && !btn.disabled());

      if (activeButton && activeButton.elementRef) {
        const element = activeButton.elementRef.nativeElement as HTMLElement;

        // Calculate style based on the active element's position and size
        const rounded = this.rounded();

        this.indicatorStyle.set({
          'width': `${element.offsetWidth}px`,
          'height': `${element.offsetHeight}px`,
          'transform': `translate(${element.offsetLeft}px, ${element.offsetTop}px)`,
          'opacity': '1'
        });
      } else {
        this.indicatorStyle.set({ 'opacity': '0' });
      }
    });

    // Effect to propagate disabled state to child buttons
    effect(() => {
      const isGroupDisabled = this.disabled();
      const allButtons = [...this.buttons(), ...this.iconButtons()];

      allButtons.forEach(btn => {
        if (btn.elementRef) {
          const element = btn.elementRef.nativeElement as HTMLElement;
          if (isGroupDisabled) {
            element.setAttribute('disabled', '');
          } else if (!btn.disabled()) {
            element.removeAttribute('disabled');
          }
        }
      });
    });
  }
}
