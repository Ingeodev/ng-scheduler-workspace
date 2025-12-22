import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '../buttons';
import { AnyEvent } from '../../../core/models/event';

/**
 * EventOverflowPopover
 * 
 * Displays a list of hidden/overflow events in a compact popover.
 * Shown when user clicks on the overflow indicator (+N more / (N) events).
 * 
 * @example
 * ```html
 * <mglon-event-overflow-popover 
 *   [events]="hiddenEvents"
 *   (closePopover)="onClose()">
 * </mglon-event-overflow-popover>
 * ```
 */
@Component({
  selector: 'mglon-event-overflow-popover',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  template: `
    <div class="overflow-popover">
      <div class="overflow-popover__header">
        <span class="overflow-popover__count">{{ events().length }} more events</span>
        <button 
          mglon-icon-button
          appereance="ghost"
          size="sm"
          (click)="close()" 
          aria-label="Close popover">
          ✕
        </button>
      </div>
      
      <div class="overflow-popover__list">
        @for (event of events(); track event.id) {
          <div class="overflow-popover__item" [title]="event.title">
            <div class="overflow-popover__item-indicator" 
                 [style.background-color]="event.color || '#0860c4'">
            </div>
            <div class="overflow-popover__item-content">
              <div class="overflow-popover__item-title">{{ event.title }}</div>
              @if (event.type === 'event') {
                <div class="overflow-popover__item-time">
                  {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './event-overflow-popover.scss'
})
export class EventOverflowPopover {
  /**
   * Array of hidden events to display
   */
  events = input.required<AnyEvent[]>();

  /**
   * Emitted when the popover should be closed
   */
  closePopover = output<void>();

  /**
   * Closes the popover
   */
  close(): void {
    this.closePopover.emit();
  }

  /**
   * Formats a date to time string (e.g., "2:30 PM")
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
