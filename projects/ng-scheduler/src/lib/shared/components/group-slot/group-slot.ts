import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyEvent } from '../../../core/models/event';
import { EventSlotRadius } from '../../../core/models/ui-config';
import { CalendarStore } from '../../../core/store/calendar.store';
import { SlotComponent, GroupSlot } from '../slot/slot';

@Component({
  selector: 'mglon-group-slot',
  standalone: true,
  imports: [CommonModule, SlotComponent],
  template: `
    @for (slot of slots(); track $index) {
      <mglon-slot
        [slot]="slot"
        [event]="event()"
        [isHovered]="isHovered()"
        [isSelected]="isSelected()"
        [showTime]="showTime()"
        [rounded]="_rounded()"
        (slotHover)="onSlotHover($event)"
        (slotClick)="onSlotClick()">
      </mglon-slot>
    }
  `,
  styleUrl: './group-slot.scss'
})
export class GroupSlotComponent {
  slots = input.required<GroupSlot[]>();
  event = input.required<AnyEvent>();

  // UI Configuration
  /**
   * Border radius for the event slot.
   * If not provided, uses the value from CalendarStore.
   */
  readonly rounded = input<EventSlotRadius | undefined>(undefined);

  private calendarStore = inject(CalendarStore);

  // Computed rounded value: use input if provided, else use Store config
  protected _rounded = computed(() =>
    this.rounded() ?? this.calendarStore.uiConfig().grid.eventSlots.rounded
  );

  // State from parent
  isHovered = input<boolean>(false);
  isSelected = input<boolean>(false);
  showTime = input<boolean>(true);

  // Outputs
  slotHover = output<boolean>(); // true=enter, false=leave
  slotClick = output<void>();

  onSlotHover(state: boolean) {
    this.slotHover.emit(state);
  }

  onSlotClick() {
    this.slotClick.emit();
  }
}
