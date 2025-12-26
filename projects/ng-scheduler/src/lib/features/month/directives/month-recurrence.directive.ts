import { Directive, ElementRef, inject, input, effect, Renderer2, ViewContainerRef } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

@Directive({
  selector: '[mglonMonthRecurrence]',
  standalone: true
})
export class MonthRecurrenceDirective {
  private el = inject(ElementRef);
  private vcr = inject(ViewContainerRef);

  /** Whether the event is recurrent */
  isRecurrent = input<boolean>(false, { alias: 'mglonMonthRecurrence' });

  constructor() {
    effect(() => {
      if (this.isRecurrent()) {
        this.addIcon();
      } else {
        this.removeIcon();
      }
    });
  }

  private addIcon(): void {
    // Check if icon already exists to avoid duplicates
    if (this.el.nativeElement.querySelector('.mglon-month-slot__recurrence-icon')) {
      return;
    }

    const componentRef = this.vcr.createComponent(IconComponent);
    componentRef.setInput('name', 'cycle');

    // Get the DOM element of the icon
    const iconElement = componentRef.location.nativeElement;
    iconElement.classList.add('mglon-month-slot__recurrence-icon');

    // Insert before the text content
    this.el.nativeElement.prepend(iconElement);
  }

  private removeIcon(): void {
    const icon = this.el.nativeElement.querySelector('.mglon-month-slot__recurrence-icon');
    if (icon) {
      icon.remove();
    }
  }
}
