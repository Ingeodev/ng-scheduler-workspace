import { Component, input, computed, contentChildren, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';
import { IconButtonComponent } from '../icon-button/icon-button';

export type ButtonGroupType = 'text' | 'icon' | 'icon-text';
export type ButtonGroupRadius = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'mglon-button-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-group.html',
  styleUrl: './button-group.scss',
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"group"'
  }
})
export class ButtonGroupComponent {
  readonly type = input<ButtonGroupType>('text');
  readonly rounded = input<ButtonGroupRadius>('full');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  // Queries for projected content
  readonly buttons = contentChildren(ButtonComponent);
  readonly iconButtons = contentChildren(IconButtonComponent);

  readonly indicatorStyle = signal<{ [key: string]: string }>({});

  constructor() {
    effect(() => {
      const allButtons = [...this.buttons(), ...this.iconButtons()];
      const activeButton = allButtons.find(btn => btn.active());

      if (activeButton && activeButton.elementRef) {
        const element = activeButton.elementRef.nativeElement as HTMLElement;

        // Calculate style based on the active element's position and size
        const rounded = this.rounded();
        const radiusMap: Record<ButtonGroupRadius, string> = {
          'sm': 'var(--mglon-schedule-radius-sm)',
          'md': 'var(--mglon-schedule-radius-md)',
          'lg': 'var(--mglon-schedule-radius-lg)',
          'full': 'var(--mglon-schedule-radius-full)'
        };

        this.indicatorStyle.set({
          'width': `${element.offsetWidth}px`,
          'height': `${element.offsetHeight}px`,
          'transform': `translate(${element.offsetLeft}px, ${element.offsetTop}px)`,
          'border-radius': radiusMap[rounded],
          'opacity': '1'
        });
      } else {
        this.indicatorStyle.set({ 'opacity': '0' });
      }
    });
  }

  classes = computed(() => {
    return [
      'mglon-button-group',
      this.orientation(),
      `type-${this.type()}`,
      `rounded-${this.rounded()}`
    ].join(' ');
  });
}
