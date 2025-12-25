import { Component, computed, inject, input } from '@angular/core';
import { SlotModel } from '../../../core/models/slot.model';
import { CalendarStore } from '../../../core/store/calendar.store';
import { getHoverColor, getTextColor } from '../../../shared/helpers';

@Component({
  selector: 'mglon-month-slot',
  imports: [],
  templateUrl: './month-slot.html',
  styleUrl: './month-slot.scss',
  host: {
    '[style.position]': '"absolute"',
    '[style.top.px]': 'slot().position.top',
    '[style.left.%]': 'slot().position.left',
    '[style.width.%]': 'slot().position.width',
    '[style.height.px]': 'slot().position.height',
    '[style.z-index]': 'slot().zIndex',
    '[style.--slot-bg]': 'slot().color',
    '[style.--slot-hover]': 'hoverColor()',
    '[style.--slot-text]': 'textColor()',
    '[attr.data-slot-type]': 'slot().type',
    '[class.mglon-month-slot--first]': 'slot().type === "first"',
    '[class.mglon-month-slot--last]': 'slot().type === "last"',
    '[class.mglon-month-slot--middle]': 'slot().type === "middle"',
    '[class.mglon-month-slot--full]': 'slot().type === "full"',
  }
})
export class MonthSlot {
  private readonly store = inject(CalendarStore);

  readonly slot = input.required<SlotModel>();

  /**
   * Gets the event data from the store using the slot's event ID.
   */
  readonly event = computed(() => {
    return this.store.getEvent(this.slot().idEvent);
  });

  /**
   * Display title for the slot.
   */
  readonly title = computed(() => {
    return this.event()?.title ?? '';
  });

  /**
   * Hover color calculated from the base color.
   */
  readonly hoverColor = computed(() => {
    return getHoverColor(this.slot().color);
  });

  /**
   * Text color with optimal contrast against the background.
   */
  readonly textColor = computed(() => {
    return getTextColor(this.slot().color);
  });
}

