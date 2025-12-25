import { Component, computed, inject, input, signal } from '@angular/core'
import { SlotModel } from '../../../core/models/slot.model'
import { CalendarStore } from '../../../core/store/calendar.store'
import { getHoverColor, getTextColor } from '../../../shared/helpers'
import { ZigzagDirective, ZigzagSide } from '../../../shared/directives/zigzag.directive'
import { ResizableDirective, ResizeSide, ResizeEvent } from '../../../shared/directives/resizable.directive'
import { EventSlotRadius } from '../../../core/models/ui-config'
import { addDays, differenceInCalendarDays } from 'date-fns'

/** Maps EventSlotRadius to CSS variable names */
const RADIUS_VAR_MAP: Record<EventSlotRadius, string> = {
  'none': '0',
  'sm': 'var(--mglon-schedule-radius-sm)', // Small fixed value for subtle rounding on slots
  'full': 'var(--mglon-schedule-radius-full)'
}

@Component({
  selector: 'mglon-month-slot',
  imports: [ZigzagDirective, ResizableDirective],
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
    '[style.--slot-bg]': 'slot().color',
    '[style.--slot-hover]': 'hoverColor()',
    '[style.--slot-text]': 'textColor()',
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

  /**
   * Display title for the slot.
   */
  readonly title = computed(() => {
    return this.event()?.title ?? ''
  })

  /**
   * Hover color calculated from the base color.
   */
  readonly hoverColor = computed(() => {
    return getHoverColor(this.slot().color)
  })

  /**
   * Text color with optimal contrast against the background.
   */
  readonly textColor = computed(() => {
    return getTextColor(this.slot().color)
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
  private startPointerPos = { x: 0, y: 0 };
  private readonly DRAG_DELAY = 150; // ms
  private readonly DRAG_THRESHOLD = 5; // px

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
        this.store.setDragHover(hoverDate);
        this.store.updateDraggedEventPosition();
      }
    }
  }

  private onPointerUp(event: PointerEvent) {
    this.store.setInteractionMode('none');
    this.store.clearDragState();
  }

  onResizeStart(event: ResizeEvent) {
    this.store.setResizeStart(this.slot().idEvent, event.side);

    // Bind movement and release for real-time resize feedback
    // Similar to drag-and-drop, we use global listeners
    const onMove = (e: PointerEvent) => this.onGlobalResizeMove(e);
    const onUp = () => {
      this.store.clearResizeState();
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
        this.store.setResizeHover(hoverDate);
        this.store.updateResizedEvent();
      }
    }
  }

  onMouseEnter() {
    this.store.setHoveredEvent(this.slot().idEvent);
  }

  onMouseLeave() {
    this.store.setHoveredEvent(null);
  }
}
