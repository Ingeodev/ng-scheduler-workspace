import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorAppearance, IndicatorRadius } from '../../../core/models/ui-config';
import { CalendarStore } from '../../../core/store/calendar.store';

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
  host: {
    '[attr.appearance]': '_appearance()',
    '[attr.rounded]': '_rounded()'
  },
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
    :host {
      // Border radius variants
      &[rounded="none"] {
        --mglon-overflow-indicator-radius: 0;
      }

      &[rounded="sm"] {
        --mglon-overflow-indicator-radius: var(--mglon-schedule-radius-sm, 4px);
      }

      &[rounded="md"] {
        --mglon-overflow-indicator-radius: var(--mglon-schedule-radius-md, 8px);
      }

      &[rounded="full"] {
        --mglon-overflow-indicator-radius: var(--mglon-schedule-radius-full, 9999px);
      }

      // Appearance variants
      &[appearance="outline"] {
        --mglon-overflow-indicator-bg: transparent;
        --mglon-overflow-indicator-border-width: 1px;
        --mglon-overflow-indicator-hover-bg: rgba(25, 103, 210, 0.08);
      }

      &[appearance="solid"] {
        --mglon-overflow-indicator-bg: var(--mglon-schedule-primary, #1967d2);
        --mglon-overflow-indicator-color: var(--mglon-schedule-on-primary, #ffffff);
        --mglon-overflow-indicator-border-width: 0;
        --mglon-overflow-indicator-hover-bg: var(--mglon-schedule-primary-dark, #1557b0);
      }

      &[appearance="ghost"] {
        --mglon-overflow-indicator-bg: transparent;
        --mglon-overflow-indicator-border-width: 0;
        --mglon-overflow-indicator-hover-bg: rgba(25, 103, 210, 0.05);
      }
    }
    
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
      color: var(--mglon-overflow-indicator-color, var(--mglon-schedule-primary, #1967d2));
      background-color: var(--mglon-overflow-indicator-bg, transparent);
      border: var(--mglon-overflow-indicator-border-width, 1px) solid var(--mglon-overflow-indicator-border, var(--mglon-schedule-primary, #1967d2));
      border-radius: var(--mglon-overflow-indicator-radius, var(--mglon-schedule-radius-sm, 4px));
      
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--mglon-overflow-indicator-hover-bg, rgba(25, 103, 210, 0.08));
        border-color: var(--mglon-overflow-indicator-hover-border, var(--mglon-schedule-primary-dark, #1557b0));
        color: var(--mglon-overflow-indicator-hover-color, var(--mglon-schedule-primary-dark, #1557b0));
      }
      
      &:active {
        background-color: var(--mglon-overflow-indicator-active-bg, rgba(25, 103, 210, 0.12));
        transform: scale(0.98);
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

  // UI Configuration
  /**
   * Appearance style for the indicator.
   * If not provided, uses the value from CalendarStore.
   */
  readonly appearance = input<IndicatorAppearance | undefined>(undefined);

  /**
   * Border radius for the indicator.
   * If not provided, uses the value from CalendarStore.
   */
  readonly rounded = input<IndicatorRadius | undefined>(undefined);

  private calendarStore = inject(CalendarStore);

  // Computed values: use input if provided, else use Store config
  protected _appearance = computed(() =>
    this.appearance() ?? this.calendarStore.uiConfig().grid.overflowIndicator.appearance
  );

  protected _rounded = computed(() =>
    this.rounded() ?? this.calendarStore.uiConfig().grid.overflowIndicator.rounded
  );

  /**
   * Emitted when the indicator is clicked
   * Emits the DOM element for CDK overlay positioning
   */
  indicatorClick = output<HTMLElement>();

  onClick(event: MouseEvent): void {
    this.indicatorClick.emit(event.currentTarget as HTMLElement);
  }
}
