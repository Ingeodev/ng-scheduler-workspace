import { Component, inject, input, effect, untracked } from '@angular/core';
import { DEFAULT_EVENT_INPUTS } from '../../../core/config/default-schedule-config';
import { CommonModule } from '@angular/common';
import { Event as EventModel, RecurrentEventModel } from '../../../core/models/event.model';
import { RESOURCE_ID_TOKEN } from '../../resource-events/resource-events';
import { CalendarStore } from '../../../core/store/calendar.store';
import { output } from '@angular/core';
import { DragInteractionData, EventInteraction, ResizeInteractionData } from '../../../core/models/interaction.model';
import { expandRecurrentEvent } from '../../../shared/helpers/recurrent-events.helpers';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'mglon-recurrent-event',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- Events are managed declaratively -->`,
  styles: [`:host { display: none; }`]
})

export class RecurrentEvent {
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

  /** Recurrence rule defining the pattern */
  readonly recurrenceRule = input.required<any>(); // TODO: Type this properly

  /** Specific dates to exclude */
  readonly recurrenceExceptions = input<Date[]>();

  // --- Interaction Outputs ---
  readonly eventClick = output<EventInteraction>();
  readonly eventDblClick = output<EventInteraction>();
  readonly eventContextMenu = output<EventInteraction>();
  readonly eventMouseEnter = output<EventInteraction>();
  readonly eventMouseLeave = output<EventInteraction>();

  private readonly destroy$ = new Subject<void>();
  private store = inject(CalendarStore)

  constructor() {
    effect(() => {
      // Trigger this effect when range OR any relevant input signal changes
      this.store.viewRange();
      this.id();
      this.title();
      this.startDate();
      this.endDate();
      this.recurrenceRule();

      untracked(() => {
        this.registerEvent();
      });
    });
  }

  ngOnInit(): void {
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
        }
      });
  }

  private currentInstanceIds: string[] = [];

  /**
   * Lifecycle: Unregister event and all its instances from store
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private cleanup(): void {
    try {
      // 1. Unregister all instances
      this.currentInstanceIds.forEach(id => this.store.unregisterEvent(id));
      this.currentInstanceIds = [];

      // 2. Unregister parent
      const parentId = this.id();
      if (parentId) {
        this.store.unregisterEvent(parentId);
      }
    } catch (e) {
      // Ignore errors during cleanup
    }
  }

  private registerEvent(): void {
    // 1. Prepare Parent Master
    const parentEvent: RecurrentEventModel = {
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
      type: 'recurrent',
      recurrenceRule: this.recurrenceRule(),
      recurrenceExceptions: this.recurrenceExceptions()
    };

    // 2. Cleanup previous instances before re-registering
    this.currentInstanceIds.forEach(id => this.store.unregisterEvent(id));
    this.currentInstanceIds = [];

    // 3. Register the parent recurrent event (Master definition)
    this.store.registerEvent(parentEvent);

    // 4. Expand and register instances for the current range
    const range = this.store.viewRange();
    const instances = expandRecurrentEvent(parentEvent, range);

    instances.forEach(instance => {
      this.store.registerEvent(instance);
      this.currentInstanceIds.push(instance.id);
    });
  }
}
