import { Component, inject, input } from '@angular/core';
import { DEFAULT_EVENT_INPUTS } from '../../core/config/default-schedule-config';
import { CommonModule } from '@angular/common';
import { Event as EventModel } from '../../core/models/event.model';
import { RESOURCE_ID_TOKEN } from '../resource-events/resource-events';
import { CalendarStore } from '../../core/store/calendar.store';

@Component({
  selector: 'mglon-event',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- Events are managed declaratively -->`,
  styles: [`:host { display: none; }`]
})

export class Event {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly startDate = input.required<Date>();
  readonly endDate = input.required<Date>();
  readonly color = input<string>(DEFAULT_EVENT_INPUTS.color);
  readonly allDay = input<boolean>(DEFAULT_EVENT_INPUTS.allDay);
  readonly description = input<string>(DEFAULT_EVENT_INPUTS.description);
  readonly data = input<any>(DEFAULT_EVENT_INPUTS.data);
  /** Optional explicit resource ID (if not nested in mglon-resource) */
  readonly resourceId = input<string>();
  private readonly parentResourceId = inject(RESOURCE_ID_TOKEN, { optional: true });

  /** If true, the event cannot be edited */
  readonly isReadOnly = input<boolean>(false);

  /** If true, the event is visually blocked (e.g., maintenance) */
  readonly isBlocked = input<boolean>(false);

  /** Flexible user-defined data */
  readonly metadata = input<any>();

  /** Tags for filtering and styling */
  readonly tags = input<string[]>([]);

  private store = inject(CalendarStore)

  ngOnInit(): void {
    this.registerEvent();
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
    const event: EventModel = {
      id: this.id(),
      resourceId: this.resourceId() || this.parentResourceId || undefined,
      title: this.title(),
      description: this.description(),
      tags: this.tags(),
      start: this.startDate(),
      end: this.endDate(),
      color: this.color(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      metadata: this.metadata(),
      type: 'event'
    };

    this.store.registerEvent(event);
  }
}
