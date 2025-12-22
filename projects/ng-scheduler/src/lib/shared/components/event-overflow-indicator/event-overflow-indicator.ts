import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * EventOverflowIndicator
 * 
 * Displays a "+N more" indicator when a day has more events than can fit in the cell.
 * Clicking the indicator can expand or show a popover (future enhancement).
 * 
 * @example
 * ```html
 * <mglon-event-overflow-indicator 
 *   [count]="3"
 *   (click)="onShowMore($event)">
 * </mglon-event-overflow-indicator>
 * ```
 */
@Component({
  selector: 'mglon-event-overflow-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="event-overflow-indicator" (click)="onClick($event)">
      <span class="overflow-count">
        @if (showAll()) {
          ({{ count() }}) events
        } @else {
          +{{ count() }} more
        }
      </span>
    </div>
  `,
  styles: [`
    .event-overflow-indicator {
      position: absolute;
      left: var(--indicator-x, 0);
      top: var(--indicator-y, 0);
      width: var(--indicator-width, 100%);
      height: 20px;
      
      display: flex;
      align-items: center;
      justify-content: center;
      
      font-size: 11px;
      font-weight: 500;
      color: var(--mglon-schedule-text-secondary, #5f6368);
      background-color: var(--mglon-schedule-surface-2, #f8f9fa);
      border-radius: var(--mglon-schedule-border-radius-sm, 4px);
      
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: var(--mglon-schedule-surface-3, #e8eaed);
        color: var(--mglon-schedule-text-primary, #202124);
      }
      
      &:active {
        background-color: var(--mglon-schedule-surface-4, #dadce0);
      }
    }
    
    .overflow-count {
      white-space: nowrap;
    }
  `]
})
export class EventOverflowIndicator {
  /**
   * Number of overflow events not displayed
   */
  count = input.required<number>();

  /**
   * Whether to show all count (true = "(n) events") or overflow count (false = "+n more")
   * true when capacity=1 and showing only indicator
   */
  showAll = input<boolean>(false);

  /**
   * Emitted when the indicator is clicked
   * Emits the DOM element for CDK overlay positioning
   */
  indicatorClick = output<HTMLElement>();

  onClick(event: MouseEvent): void {
    this.indicatorClick.emit(event.currentTarget as HTMLElement);
  }
}
