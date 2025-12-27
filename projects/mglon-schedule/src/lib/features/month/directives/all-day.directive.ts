import { Directive, ElementRef, inject, input, effect, ViewContainerRef } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

@Directive({
  selector: '[mglonAllDay]',
  standalone: true
})
export class AllDayDirective {
  private el = inject(ElementRef);
  private vcr = inject(ViewContainerRef);

  /** Whether the event is all-day */
  isAllDay = input<boolean>(false, { alias: 'mglonAllDay' });

  /** Color for the dot icon */
  dotColor = input<string>('');

  constructor() {
    effect(() => {
      if (this.isAllDay()) {
        this.addIcon();
        // The host binding in MonthSlot will handle most styling, 
        // but we add a class for extra specificity if needed.
        this.el.nativeElement.classList.add('mglon-event--all-day');
      } else {
        this.removeIcon();
        this.el.nativeElement.classList.remove('mglon-event--all-day');
      }
    });

    // Handle dynamic color changes for the dot
    effect(() => {
      const color = this.dotColor();
      const icon = this.el.nativeElement.querySelector('.mglon-event__all-day-icon');
      if (icon && color) {
        icon.style.color = color;
      }
    });
  }

  private addIcon(): void {
    if (this.el.nativeElement.querySelector('.mglon-event__all-day-icon')) {
      return;
    }

    const componentRef = this.vcr.createComponent(IconComponent);
    componentRef.setInput('name', 'dot');

    const iconElement = componentRef.location.nativeElement;
    iconElement.classList.add('mglon-event__all-day-icon');

    if (this.dotColor()) {
      iconElement.style.color = this.dotColor();
    }

    // Insert before the title/text
    this.el.nativeElement.prepend(iconElement);
  }

  private removeIcon(): void {
    const icon = this.el.nativeElement.querySelector('.mglon-event__all-day-icon');
    if (icon) {
      icon.remove();
    }
  }
}
