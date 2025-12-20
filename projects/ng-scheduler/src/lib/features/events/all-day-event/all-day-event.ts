import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllDayEvent } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';

/**
 * AllDayEventComponent - Declarative component for all-day calendar events
 * 
 * Usage:
 * <mglon-all-day-event
 *   id="holiday-1"
 *   title="Company Holiday"
 *   [date]="holidayDate">
 * </mglon-all-day-event>
 */
@Component({
  selector: 'mglon-all-day-event',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [`:host { display: none; }`]
})
export class AllDayEventComponent implements OnInit, OnDestroy {
  private readonly store = inject(EventStore);

  /** Unique identifier for the event */
  readonly id = input.required<string>();

  /** Foreign key: ID of the resource this event belongs to (optional) */
  readonly resourceId = input<string>();

  /** Display title of the event */
  readonly title = input.required<string>();

  /** Additional description or notes for the event */
  readonly description = input<string>();

  /** Tags for filtering and styling */
  readonly tags = input<string[]>([]);

  /** 
   * Date for the all-day event
   * For multi-day events, this represents the start date
   */
  readonly date = input.required<Date>();

  /**
   * Optional end date for multi-day all-day events
   * If not provided, the event is a single-day event
   */
  readonly endDate = input<Date>();

  /** Event color (overrides resource color if set) */
  readonly color = input<string>();

  /** If true, the event cannot be edited */
  readonly isReadOnly = input<boolean>(false);

  /** If true, the event is visually blocked */
  readonly isBlocked = input<boolean>(false);

  /** Flexible user-defined data */
  readonly metadata = input<any>();

  ngOnInit(): void {
    this.registerEvent();
  }

  ngOnDestroy(): void {
    this.store.unregisterEvent(this.id());
  }

  private registerEvent(): void {
    const event: AllDayEvent = {
      id: this.id(),
      resourceId: this.resourceId(),
      title: this.title(),
      description: this.description(),
      tags: this.tags(),
      date: this.date(),
      endDate: this.endDate(),
      color: this.color(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      metadata: this.metadata(),
      type: 'all-day'
    };

    this.store.registerEvent(event);
  }
}
