import { Component, computed, inject, input, signal } from '@angular/core'
import { SlotModel } from '../../../core/models/slot.model'
import { CalendarStore } from '../../../core/store/calendar.store'
import { getHoverColor, getTextColor } from '../../../shared/helpers'
import { ZigzagDirective, ZigzagSide } from '../../../shared/directives/zigzag.directive'
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
  imports: [ZigzagDirective],
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
  }
})
export class MonthSlot {
  private readonly store = inject(CalendarStore)

  readonly slot = input.required<SlotModel>()

  /** Whether this specific event is being dragged */
  readonly isDragging = computed(() => this.store.dragState().eventId === this.slot().idEvent)

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

  onDragStart(event: DragEvent) {
    // Calculate which specific day within the slot was grabbed
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const slotWidth = rect.width

    const daysSpan = differenceInCalendarDays(this.slot().end, this.slot().start) + 1
    const dayOffset = Math.max(0, Math.min(Math.floor((clickX / slotWidth) * daysSpan), daysSpan - 1))
    const grabDate = addDays(this.slot().start, dayOffset)

    this.store.setDragStart(this.slot().idEvent, grabDate)

    if (event.dataTransfer) {
      // We still need to set something to enable native dragging
      event.dataTransfer.setData('text/plain', this.slot().idEvent)
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  onDragEnd() {
    this.store.clearDragState()
  }
}
