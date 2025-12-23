import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyEvent } from '../../../core/models/event';
import { EventRenderData } from '../../../core/rendering/event-renderer';
import { EventSlotRadius } from '../../../core/models/ui-config';
import { CalendarStore } from '../../../core/store/calendar.store';

export interface GroupSlot {
  renderData: EventRenderData;
  style: Record<string, any>;
}

@Component({
  selector: 'mglon-group-slot',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[attr.rounded]': '_rounded()'
  },
  template: `
    @for (slot of slots(); track $index) {
      <div 
        class="group-slot"
        [class.is-hovered]="isHovered()"
        [class.is-selected]="isSelected()"
        [class.has-continuation-left]="!slot.renderData.isStart"
        [class.has-continuation-right]="!slot.renderData.isEnd"
        [style]="slot.style"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
        (click)="onClick($event)">
        
        <!-- Event content -->
        <div class="group-slot__content">
          <span class="group-slot__title">{{ event().title }}</span>
          @if (showTime()) {
          <span class="group-slot__time">
            {{ formatTime(event()) }}
          </span>
          }
        </div>
        
        <!-- Continuation indicators -->
        <!-- Note: We can simplify this if the border-radius trick works well, 
             but keeping structure similar to original for safety -->
      </div>
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

  onMouseEnter() {
    this.slotHover.emit(true);
  }

  onMouseLeave() {
    this.slotHover.emit(false);
  }

  onClick(e: MouseEvent) {
    e.stopPropagation();
    this.slotClick.emit();
  }

  formatTime(event: AnyEvent): string {
    if (event.type !== 'event') return '';
    const start = event.start;
    const end = event.end;
    const formatHour = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  }
}
