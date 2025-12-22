import { Component, input, output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, AnyEvent } from '../../../core/models/event';
import { EventStore } from '../../../core/store/event.store';
import { RESOURCE_ID_TOKEN } from '../resource/resource';

/**
 * EventComponent - Declarative component representing a calendar event
 * 
 * @example
 * ```html
 * <mglon-resource id="room-1">
 *   <mglon-event 
 *     id="evt-1"
 *     title="Team Meeting"
 *     [start]="startDate"
 *     [end]="endDate">
 *   </mglon-event>
 * </mglon-resource>
 * ```
 */
@Component({
  selector: 'mglon-event',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- Events are managed declaratively -->`,
  styles: [`:host { display: none; }`]
})
export class EventComponent implements OnInit, OnDestroy {
  private readonly store = inject(EventStore);

  // Automatically inject parent resource ID
  private readonly parentResourceId = inject(RESOURCE_ID_TOKEN, { optional: true });

  /** Unique identifier for the event */
  readonly id = input.required<string>();

  /** Optional explicit resource ID (if not nested in mglon-resource) */
  readonly resourceId = input<string>();

  /** Event title */
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

  /**
   * Emitted when the event is clicked
   * Provides granular control over individual event clicks
   * Emits the full event data for context
   */
  readonly eventClick = output<AnyEvent>();

  ngOnInit(): void {
    this.registerEvent();

    // Register click output reference
    // this.store.registerEventHandler(this.id(), {
    //   eventClick: this.eventClick
    // });
  }

  /**
   * Lifecycle: Unregister event from store
   */
  ngOnDestroy(): void {
    // Only unregister if the component was fully initialized
    try {
      const eventId = this.id();
      if (eventId) {
        this.store.unregisterEvent(eventId);
      }
    } catch (e) {
      // Ignore errors during cleanup (e.g., inputs not yet initialized in tests)
    }
  }

  private registerEvent(): void {
    const event: Event = {
      id: this.id(),
      resourceId: this.resourceId() || this.parentResourceId || undefined,
      title: this.title(),
      description: this.description(),
      tags: this.tags(),
      start: this.start(),
      end: this.end(),
      color: this.color(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      metadata: this.metadata(),
      type: 'event',
      _clickEmitter: this.eventClick // DIRECT REGISTRATION
    };

    this.store.registerEvent(event);
  }
}
