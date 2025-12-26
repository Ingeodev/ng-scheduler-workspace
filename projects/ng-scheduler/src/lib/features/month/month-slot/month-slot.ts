import { Component, computed, inject, input } from '@angular/core'
import { SlotModel } from '../../../core/models/slot.model'
import { CalendarStore } from '../../../core/store/calendar.store'
import { ZigzagDirective, ZigzagSide } from '../../../shared/directives/zigzag.directive'
import { ResizableDirective, ResizeEvent, ResizeSide } from '../../../shared/directives/resizable.directive'
import { DragInteractionData, ResizeInteractionData } from '../../../core/models/interaction.model'
import { EventSlotRadius } from '../../../core/models/ui-config'
import { addDays, differenceInCalendarDays } from 'date-fns'
import { MonthRecurrenceDirective } from '../directives/month-recurrence.directive'

/** Maps EventSlotRadius to CSS variable names */
const RADIUS_VAR_MAP: Record<EventSlotRadius, string> = {
  'none': '0',
  'sm': 'var(--mglon-schedule-radius-sm)', // Small fixed value for subtle rounding on slots
  'full': 'var(--mglon-schedule-radius-full)'
}

import { generateAdaptiveColorScheme, getEventColor } from '../../../shared/helpers/color.helpers'

@Component({
  selector: 'mglon-month-slot',
  imports: [ZigzagDirective, ResizableDirective, MonthRecurrenceDirective],
  templateUrl: './month-slot.html',
  styleUrl: './month-slot.scss',
  host: {
    '[style.position]': '"absolute"',
    '[style.top.px]': 'slot().position.top',
    '[style.left.%]': 'slot().position.left',
    '[style.width.%]': 'slot().position.width',
    '[style.--slot-width.%]': 'slot().position.width',
    '[style.height.px]': 'slot().position.height',
    '[style.z-index]': 'slot().zIndex',
    '[style.--slot-bg]': 'colorScheme().base',
    '[style.--slot-hover]': 'colorScheme().hover',
    '[style.--slot-text]': 'colorScheme().text',
    '[style.--slot-text-hover]': 'colorScheme().textHover',
    '[style.--slot-radius]': 'slotRadius()',
    '[attr.data-slot-type]': 'slot().type',
    '[class.mglon-month-slot--first]': 'slot().type === "first"',
    '[class.mglon-month-slot--last]': 'slot().type === "last"',
    '[class.mglon-month-slot--middle]': 'slot().type === "middle"',
    '[class.mglon-month-slot--full]': 'slot().type === "full"',
    '[class.mglon-month-slot--dragging]': 'isDragging()',
    '[class.mglon-month-slot--idle]': '!isDragging()',
    '[class.mglon-month-slot--hovered]': 'isHovered()',
  }
})
export class MonthSlot {
  private readonly store = inject(CalendarStore)

  readonly slot = input.required<SlotModel>()

  /** Whether this specific event is being dragged */
  readonly isDragging = computed(() => this.store.dragState().eventId === this.slot().idEvent)

  /** Whether this event is currently hovered globally */
  readonly isHovered = computed(() => this.store.hoveredEventId() === this.slot().idEvent)

  /**
   * Gets the event data from the store using the slot's event ID.
   */
  readonly event = computed(() => {
    return this.store.getEvent(this.slot().idEvent)
  })

  /** Whether this event is part of a recurrence series */
  readonly isRecurrent = computed(() => {
    const e = this.event()
    return e?.type === 'event' && e.isRecurrenceInstance === true
  })

  /**
   * Display title for the slot.
   */
  readonly title = computed(() => {
    return this.event()?.title ?? ''
  })

  /**
   * Complete color scheme calculation based on event type
   */
  readonly colorScheme = computed(() => {
    // 1. Resolve base raw color
    const rawColor = getEventColor(
      { color: this.slot().color, resourceId: this.event()?.resourceId },
      (id) => this.store.getResource(id),
      this.store.uiConfig().grid.eventSlots.color || '#1a73e8'
    );

    // 2. Generate all adaptive variants
    const scheme = generateAdaptiveColorScheme(rawColor);

    // 3. Select variant based on configuration and event type
    const useDynamic = this.store.uiConfig().grid.useDynamicColors;

    if (!useDynamic) {
      return scheme.raw;
    }

    return this.isRecurrent() ? scheme.pastel : scheme.vivid;
  })

  /**
   * Border radius from uiConfig, mapped to CSS variable.
   */
  readonly slotRadius = computed(() => {
    const rounded = this.store.uiConfig().grid.eventSlots.rounded
    return RADIUS_VAR_MAP[rounded]
  })

  /**
   * Determines which sides get zigzag effect based on slot type.
   * - 'first': right side (continues to next week)
   * - 'last': left side (comes from previous week)
   * - 'middle': both sides (spans entire week)
   * - 'full': no zigzag (complete within week)
   */
  readonly zigzagSides = computed<ZigzagSide[]>(() => {
    const type = this.slot().type
    switch (type) {
      case 'first':
        return ['right']
      case 'last':
        return ['left']
      case 'middle':
        return ['left', 'right']
      default:
        return []
    }
  })

  /**
   * Determines which sides are resizable.
   * Only sides without zigzag are resizable, and only if resizableEvents is enabled.
   */
  readonly resizableSides = computed<ResizeSide[]>(() => {
    // Check global config from store
    if (!this.store.config().resizableEvents) {
      return []
    }

    // Check resource-specific config if available
    const event = this.event()
    if (event?.resourceId) {
      const resource = this.store.getResource(event.resourceId)
      if (resource && resource.resizableEvents === false) {
        return []
      }
    }

    const type = this.slot().type
    switch (type) {
      case 'first':
        return ['left']
      case 'last':
        return ['right']
      case 'middle':
        return []
      case 'full':
        return ['left', 'right']
      default:
        return []
    }
  })

  private dragDelayTimer?: any;
  private readonly DRAG_DELAY = 150; // ms
  private readonly DRAG_THRESHOLD = 5; // px
  private startPointerPos = { x: 0, y: 0 };

  private clickTimer?: any;
  private ignoreNextClick = false;

  onPointerDown(event: PointerEvent) {
    // Only handle primary button and if no other interaction is active
    if (event.button !== 0 || this.store.interactionMode() !== 'none') return;

    // Check if we clicked a resize handle
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const sides = this.resizableSides();
    const handleSize = 6; // Matching ResizableDirective default

    if (sides.includes('left') && x <= handleSize) return;
    if (sides.includes('right') && x >= rect.width - handleSize) return;

    // Stop propagation immediately to prevent background selection from seeing this event
    event.stopPropagation();

    this.startPointerPos = { x: event.clientX, y: event.clientY };

    // Lock the mutex immediately to block other potential listeners (like Selection)
    this.store.setInteractionMode('dragging');

    this.dragDelayTimer = setTimeout(() => {
      this.initiateDrag(event);
    }, this.DRAG_DELAY);

    // Bind movement and release to handle cancellation
    const onMove = (e: PointerEvent) => this.onGlobalMove(e);
    const onUp = (e: PointerEvent) => {
      this.onGlobalUp(e);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  private initiateDrag(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement || event.target as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }

    // Calculate grabDate (exact day clicked)
    const rect = target.getBoundingClientRect();
    const clickX = this.startPointerPos.x - rect.left;
    const slotWidth = rect.width;

    const daysSpan = differenceInCalendarDays(this.slot().end, this.slot().start) + 1;
    const dayOffset = Math.max(0, Math.min(Math.floor((clickX / slotWidth) * daysSpan), daysSpan - 1));
    const grabDate = addDays(this.slot().start, dayOffset);

    this.store.setDragStart(this.slot().idEvent, grabDate);
    this.store.setInteractionMode('dragging');

    // Dispatch dragStart interaction
    this.store.dispatchInteraction('dragStart', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id,
      data: {
        grabDate,
        hoverDate: null
      } as DragInteractionData
    });
  }

  private onGlobalMove(event: PointerEvent) {
    if (this.store.dragState().eventId) { // Check if we are actually dragging (timer finished)
      this.onPointerMove(event);
    } else if (this.dragDelayTimer) {
      // Check if we moved too much before the delay finished
      const dist = Math.sqrt(
        Math.pow(event.clientX - this.startPointerPos.x, 2) +
        Math.pow(event.clientY - this.startPointerPos.y, 2)
      );

      if (dist > this.DRAG_THRESHOLD) {
        this.store.setInteractionMode('none'); // Release mutex if it was a scroll/swipe
        this.cancelDragDelay();
      }
    }
  }

  private onGlobalUp(event: PointerEvent) {
    this.cancelDragDelay();
    if (this.store.dragState().eventId) {
      this.onPointerUp(event);
      // Occlude the next click event that follows pointerup
      this.ignoreNextClick = true;
    } else {
      // It was just a click or a cancelled drag, release mutex
      this.store.setInteractionMode('none');
    }
  }

  private cancelDragDelay() {
    if (this.dragDelayTimer) {
      clearTimeout(this.dragDelayTimer);
      this.dragDelayTimer = undefined;
    }
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.isDragging()) return;

    // Detect which cell we are over using coordinates
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cell = element?.closest('.mglon-month-cell') as HTMLElement | null;

    if (cell) {
      const timestamp = cell.getAttribute('data-mglon-date');
      if (timestamp) {
        const hoverDate = new Date(parseInt(timestamp, 10));
        this.store.setDragHover(hoverDate)
        this.store.updateDraggedEventPosition()

        // Dispatch drag interaction event
        this.store.dispatchInteraction('drag', this.slot().idEvent, {
          event: this.event()!,
          slotId: this.slot().id,
          data: {
            grabDate: this.store.dragState().grabDate!,
            hoverDate: hoverDate
          } as DragInteractionData
        })
      }
    }
  }

  private onPointerUp(event: PointerEvent) {
    // Dispatch dragEnd interaction before clearing state
    const dragState = this.store.dragState();
    this.store.dispatchInteraction('dragEnd', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id,
      data: {
        grabDate: dragState.grabDate!,
        hoverDate: dragState.hoverDate
      } as DragInteractionData
    });

    this.store.setInteractionMode('none');
    this.store.clearDragState();
  }

  onResizeStart(event: ResizeEvent) {
    this.store.setResizeStart(this.slot().idEvent, event.side);

    // Dispatch resizeStart interaction
    this.store.dispatchInteraction('resizeStart', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id,
      data: {
        side: event.side,
        date: this.slot().start // Basic reference date for start
      } as ResizeInteractionData
    });

    // Bind movement and release for real-time resize feedback
    // Similar to drag-and-drop, we use global listeners
    const onMove = (e: PointerEvent) => this.onGlobalResizeMove(e);
    const onUp = () => {
      // Occlude the next click event
      this.ignoreNextClick = true;

      // Dispatch resizeEnd interaction before clearing state
      const resizeState = this.store.resizeState();
      this.store.dispatchInteraction('resizeEnd', this.slot().idEvent, {
        event: this.event()!,
        slotId: this.slot().id,
        data: {
          side: resizeState.side!,
          date: resizeState.hoverDate || (resizeState.side === 'left' ? this.slot().start : this.slot().end)
        } as ResizeInteractionData
      });

      this.store.clearResizeState();
      this.store.setInteractionMode('none');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  private onGlobalResizeMove(event: PointerEvent) {
    if (this.store.interactionMode() !== 'resizing') return;

    // Detect which cell we are over using coordinates
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cell = element?.closest('.mglon-month-cell') as HTMLElement | null;

    if (cell) {
      const timestamp = cell.getAttribute('data-mglon-date');
      if (timestamp) {
        const hoverDate = new Date(parseInt(timestamp, 10));
        this.store.setResizeHover(hoverDate)
        this.store.updateResizedEvent()

        // Dispatch resize interaction event
        this.store.dispatchInteraction('resize', this.slot().idEvent, {
          event: this.event()!,
          slotId: this.slot().id,
          data: {
            side: this.store.resizeState().side!,
            date: hoverDate
          } as ResizeInteractionData
        })
      }
    }
  }

  onMouseEnter() {
    if (this.store.interactionMode() !== 'none') return;
    this.store.setHoveredEvent(this.slot().idEvent);
    this.store.dispatchInteraction('mouseenter', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id
    });
  }

  onMouseLeave() {
    if (this.store.interactionMode() !== 'none') return;
    this.store.setHoveredEvent(null);
    this.store.dispatchInteraction('mouseleave', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id
    });
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();

    // Prevent click if we just finished a drag or resize
    if (this.ignoreNextClick) {
      this.ignoreNextClick = false;
      return;
    }

    // Double click detection: if another click arrives within 250ms, cancel this one
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = undefined;
      return;
    }

    this.clickTimer = setTimeout(() => {
      this.clickTimer = undefined;
      this.store.dispatchInteraction('click', this.slot().idEvent, {
        event: this.event()!,
        slotId: this.slot().id,
        originalEvent: event
      });
    }, 250);
  }

  onDblClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = undefined;
    }

    this.store.dispatchInteraction('dblclick', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id,
      originalEvent: event
    });
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatchInteraction('contextmenu', this.slot().idEvent, {
      event: this.event()!,
      slotId: this.slot().id,
      originalEvent: event
    });
  }
}
