import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurrentEvent, RecurrenceType, DayOfWeek } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';

/**
 * RecurrentEventComponent - Declarative component for recurring calendar events
 * 
 * Usage:
 * <mglon-recurrent-event
 *   id="meeting-series-1"
 *   title="Weekly Team Sync"
 *   [start]="startDate"
 *   [end]="endDate"
 *   recurrenceType="weekly"
 *   [interval]="1"
 *   [byDay]="['Mon', 'Wed', 'Fri']">
 * </mglon-recurrent-event>
 */
@Component({
  selector: 'mglon-recurrent-event',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [`:host { display: none; }`]
})
export class RecurrentEventComponent implements OnInit, OnDestroy {
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

  /** Start date and time of the first occurrence */
  readonly start = input.required<Date>();

  /** End date and time of the first occurrence */
  readonly end = input.required<Date>();

  /** Event color (overrides resource color if set) */
  readonly color = input<string>();

  // Recurrence-specific properties

  /** Type of recurrence pattern */
  readonly recurrenceType = input.required<RecurrenceType>();

  /** Interval between occurrences (e.g., 2 = every 2 days/weeks) */
  readonly interval = input<number>(1);

  /** Number of occurrences before stopping */
  readonly count = input<number>();

  /** End date for the recurrence pattern */
  readonly until = input<Date>();

  /** Days of the week for weekly recurrence (e.g., ['Mon', 'Wed', 'Fri']) */
  readonly byDay = input<DayOfWeek[]>();

  /** Months for yearly recurrence (e.g., [1, 6] for Jan and Jun) */
  readonly byMonth = input<number[]>();

  /** Days of the month for monthly recurrence (e.g., [1, 15]) */
  readonly byMonthDay = input<number[]>();

  /** Position in the set (e.g., [-1] for last occurrence) */
  readonly bySetPos = input<number[]>();

  /** Specific dates to exclude from the recurrence pattern */
  readonly recurrenceExceptions = input<Date[]>([]);

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
    const event: RecurrentEvent = {
      id: this.id(),
      resourceId: this.resourceId(),
      title: this.title(),
      description: this.description(),
      tags: this.tags(),
      start: this.start(),
      end: this.end(),
      color: this.color(),
      recurrenceRule: {
        type: this.recurrenceType(),
        interval: this.interval(),
        count: this.count(),
        until: this.until(),
        byDay: this.byDay(),
        byMonth: this.byMonth(),
        byMonthDay: this.byMonthDay(),
        bySetPos: this.bySetPos()
      },
      recurrenceExceptions: this.recurrenceExceptions(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      metadata: this.metadata(),
      type: 'recurrent'
    };

    this.store.registerEvent(event);
  }
}
