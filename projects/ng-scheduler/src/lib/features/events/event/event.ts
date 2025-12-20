import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';

/**
 * EventComponent - Declarative component for regular calendar events
 * 
 * Usage:
 * <mglon-event
 *   id="event-1"
 *   title="Team Meeting"
 *   [start]="startDate"
 *   [end]="endDate"
 *   [resourceId]="'room-1'">
 * </mglon-event>
 */
@Component({
  selector: 'mglon-event',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [`:host { display: none; }`]
})
export class EventComponent implements OnInit, OnDestroy {
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

  /** Start date and time of the event */
  readonly start = input.required<Date>();

  /** End date and time of the event */
  readonly end = input.required<Date>();

  /** Event color (overrides resource color if set) */
  readonly color = input<string>();

  /** If true, the event cannot be edited */
  readonly isReadOnly = input<boolean>(false);

  /** If true, the event is visually blocked (e.g., maintenance) */
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
    const event: Event = {
      id: this.id(),
      resourceId: this.resourceId(),
      title: this.title(),
      description: this.description(),
      tags: this.tags(),
      start: this.start(),
      end: this.end(),
      color: this.color(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      metadata: this.metadata(),
      type: 'event'
    };

    this.store.registerEvent(event);
  }
}
