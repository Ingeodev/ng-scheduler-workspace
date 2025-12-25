import { Component, computed, inject, input } from '@angular/core'
import { CalendarWeek, isEventInRange } from '../../../shared/helpers'
import { MonthCell } from '../month-cell/month-cell'
import { CELL_HEADER_HEIGHT, SLOT_HEIGHT, SLOT_GAP } from '../../../core/config/default-schedule-config'
import { MonthWeekEventsContainer } from "../month-week-events-container/month-week-events-container"
import { CalendarStore } from '../../../core/store/calendar.store'
import { endOfDay, startOfDay } from 'date-fns'
import { AnyEvent } from '../../../core/models/event.model'
import { DateRange } from '../../../core/models/date-range.model'
import { EventRendererAdapter } from '../../../core/adapters/event-renderer.adapter'
import { SlotModel } from '../../../core/models/slot.model'
import { sliceEventsByWeek } from '../../../core/rendering/slicers/month'

@Component({
  selector: 'mglon-month-week',
  imports: [MonthCell, MonthWeekEventsContainer],
  templateUrl: './month-week.html',
  styleUrl: './month-week.scss',
  host: {
    '[style.height.px]': 'weekHeight()',
    '[class.mglon-month-week--expanded]': 'expanded()'
  }
})
export class MonthWeek extends EventRendererAdapter {

  private readonly store = inject(CalendarStore)

  readonly week = input.required<CalendarWeek>()

  /** Index of this week in the month (0-based) */
  readonly weekIndex = input<number>(0)

  /** Whether this week is expanded to show all events */
  readonly expanded = input<boolean>(false)

  readonly top = CELL_HEADER_HEIGHT

  /** Minimum height for the week row from store config */
  readonly minHeight = this.store.minWeekRowHeight

  /**
   * Computes the week's date range from first to last day.
   */
  private readonly weekRange = computed<DateRange>(() => {
    const weekDays = this.week().days
    if (weekDays.length === 0) {
      return { start: new Date(), end: new Date() }
    }
    return {
      start: startOfDay(weekDays[0].date),
      end: endOfDay(weekDays[weekDays.length - 1].date)
    }
  })

  /**
   * Available height for event slots (total row height minus cell header).
   */
  private readonly availableHeight = computed(() => {
    return Math.max(0, this.store.weekRowHeight() - CELL_HEADER_HEIGHT)
  })

  /**
   * Filters currentViewEvents to only include events
   * that intersect with this week's date range.
   */
  readonly events = computed(() => {
    const weekDays = this.week().days
    if (weekDays.length === 0) return []

    return this.filterEvents(this.store.currentViewEvents(), this.weekRange())
  })

  /**
   * Computed slots for this week's events.
   */
  readonly slots = computed(() => {
    return this.createSlots(this.events())
  })

  /**
   * Maximum row number used by any slot.
   * Derived from the slot's top position.
   */
  readonly maxRow = computed(() => {
    const allSlots = this.slots()
    if (allSlots.length === 0) return 0
    // Calculate row from top position: row = top / (SLOT_HEIGHT + SLOT_GAP)
    const rowHeight = SLOT_HEIGHT + SLOT_GAP
    return Math.max(...allSlots.map(slot => Math.floor(slot.position.top / rowHeight)))
  })

  /**
   * Height needed to show all events when expanded.
   * Calculated based on the number of slot rows plus bottom padding.
   */
  readonly expandedHeight = computed(() => {
    const rows = this.maxRow() + 1 // rows are 0-indexed
    // Formula: header + (rows * slot height) + (rows * gap)
    return CELL_HEADER_HEIGHT + (rows * SLOT_HEIGHT) + (rows * SLOT_GAP)
  })

  /**
   * Whether the week has more events than can fit in the minimum height.
   * Used to conditionally show the expand toggle.
   */
  readonly hasOverflow = computed(() => {
    return this.expandedHeight() > this.minHeight()
  })

  /**
   * Dynamic height for the week based on expansion state.
   * Returns the expanded height or minimum height.
   */
  readonly weekHeight = computed(() => {
    if (this.expanded()) {
      // When expanded, use the larger of expandedHeight or minHeight
      return Math.max(this.expandedHeight(), this.minHeight())
    }
    return null // Use min-height only (CSS handles it)
  })

  override filterEvents(events: AnyEvent[], dateRange: DateRange): AnyEvent[] {
    return events.filter(event =>
      isEventInRange(event, dateRange)
    )
  }

  override createSlots(events: AnyEvent[]): SlotModel[] {
    if (events.length === 0) return []

    return sliceEventsByWeek(events, this.weekRange())
  }
}
