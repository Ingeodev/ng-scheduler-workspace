import { Component, inject, input } from '@angular/core';
import { DEFAULT_EVENT_INPUTS } from '../../../core/config/default-schedule-config';
import { CommonModule } from '@angular/common';
import { Event as EventModel } from '../../../core/models/event.model';
import { RESOURCE_ID_TOKEN } from '../../resource-events/resource-events';
import { CalendarStore } from '../../../core/store/calendar.store';
import { output } from '@angular/core';
import { DragInteractionData, EventInteraction, ResizeInteractionData } from '../../../core/models/interaction.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  readonly color = input<string>();
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

  // --- Interaction Outputs ---
  readonly eventClick = output<EventInteraction>();
  readonly eventDblClick = output<EventInteraction>();
  readonly eventContextMenu = output<EventInteraction>();
  readonly eventMouseEnter = output<EventInteraction>();
  readonly eventMouseLeave = output<EventInteraction>();
  readonly eventResizeStart = output<EventInteraction<ResizeInteractionData>>();
  readonly eventResize = output<EventInteraction<ResizeInteractionData>>();
  readonly eventResizeEnd = output<EventInteraction<ResizeInteractionData>>();
  readonly eventDragStart = output<EventInteraction<DragInteractionData>>();
  readonly eventDrag = output<EventInteraction<DragInteractionData>>();
  readonly eventDragEnd = output<EventInteraction<DragInteractionData>>();

  private readonly destroy$ = new Subject<void>();
  private store = inject(CalendarStore)

  ngOnInit(): void {
    this.registerEvent();
    this.setupInteractionListeners();
  }

  private setupInteractionListeners(): void {
    this.store.getInteractions()
      .pipe(
        filter(e => e.eventId === this.id()),
        takeUntil(this.destroy$)
      )
      .subscribe(e => {
        switch (e.type) {
          case 'click': this.eventClick.emit(e.payload); break;
          case 'dblclick': this.eventDblClick.emit(e.payload); break;
          case 'contextmenu': this.eventContextMenu.emit(e.payload); break;
          case 'mouseenter': this.eventMouseEnter.emit(e.payload); break;
          case 'mouseleave': this.eventMouseLeave.emit(e.payload); break;
          case 'resizeStart': this.eventResizeStart.emit(e.payload); break;
          case 'resize': this.eventResize.emit(e.payload); break;
          case 'resizeEnd': this.eventResizeEnd.emit(e.payload); break;
          case 'dragStart': this.eventDragStart.emit(e.payload); break;
          case 'drag': this.eventDrag.emit(e.payload); break;
          case 'dragEnd': this.eventDragEnd.emit(e.payload); break;
        }
      });
  }

  /**
   * Lifecycle: Unregister event from store
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      isAllDay: this.allDay(),
      metadata: this.metadata(),
      type: 'event'
    };

    this.store.registerEvent(event);
  }
}
