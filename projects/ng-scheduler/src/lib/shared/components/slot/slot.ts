import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyEvent } from '../../../core/models/event';
import { EventRenderData } from '../../../core/rendering/event-renderer';

export interface GroupSlot {
  renderData: EventRenderData;
  style: Record<string, any>;
}

@Component({
  selector: 'mglon-slot',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[attr.rounded]': 'rounded()',
    '[attr.data-is-start]': 'isStart()',
    '[attr.data-is-end]': 'isEnd()',
    '[attr.data-is-continuation]': 'isContinuation()',
    '[attr.data-is-complete]': 'isComplete()'
  },
  template: `
    <div 
      class="slot"
      [class.is-hovered]="isHovered()"
      [class.is-selected]="isSelected()"
      [class.has-continuation-left]="!isStart()"
      [class.has-continuation-right]="!isEnd()"
      [class.is-complete]="isComplete()"
      [style]="slot().style"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="onClick($event)">
      
      <!-- Event content -->
      <div class="slot__content">
        <span class="slot__title">{{ event().title }}</span>
        @if (showTime()) {
        <span class="slot__time">
          {{ formatTime(event()) }}
        </span>
        }
      </div>
    </div>
  `,
  styleUrl: './slot.scss'
})
export class SlotComponent {
  slot = input.required<GroupSlot>();
  event = input.required<AnyEvent>();

  // UI State
  isHovered = input<boolean>(false);
  isSelected = input<boolean>(false);
  showTime = input<boolean>(true);

  // Styling
  rounded = input<string | undefined>(undefined);

  // Slot Positioning State
  isStart = computed(() => !!this.slot().renderData.isStart);
  isEnd = computed(() => !!this.slot().renderData.isEnd);

  isContinuation = computed(() => !this.isStart());
  isComplete = computed(() => this.isStart() && this.isEnd());

  // Outputs
  slotHover = output<boolean>();
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
