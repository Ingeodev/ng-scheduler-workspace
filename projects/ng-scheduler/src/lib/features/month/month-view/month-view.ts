import { Component, inject, computed, effect, viewChild, ElementRef, afterNextRender, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MonthHeader } from '../month-header/month-header';
import { MonthGrid } from '../month-grid/month-grid';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';
import { EventRenderComponent } from '../../../shared/components/event-render/event-render';
import { EventRendererFactory } from '../../../core/rendering/event-renderer.factory';
import { GridSyncService } from '../../../core/services/grid-sync.service';
import { EventSlotAssigner, SlottedEvent } from '../../../core/rendering/event-slot-assigner';
import { EventOverflowIndicator } from '../../../shared/components/event-overflow-indicator/event-overflow-indicator';
import { EventOverflowPopover } from '../../../shared/components/event-overflow-popover/event-overflow-popover';
import { AnyEvent } from '../../../core/models/event';
import { getMonthCalendarGrid } from '../../../shared/helpers';

@Component({
  selector: 'mglon-month-view',
  standalone: true,
  imports: [CommonModule, MonthHeader, MonthGrid, EventRenderComponent, EventOverflowIndicator],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView {
  readonly calendarStore = inject(CalendarStore);
  readonly eventStore = inject(EventStore);
  readonly gridSync = inject(GridSyncService);

  // Get month grid element reference
  readonly gridElement = viewChild<ElementRef<HTMLElement>>('gridRef');

  // Event renderer for this view
  private readonly renderer = EventRendererFactory.getRenderer('month');

  // Slot assigner for preventing overlaps
  private readonly slotAssigner = new EventSlotAssigner();

  // Overlay service for popover
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  /**
   * Emitted when an event is clicked (from grid or popover)
   */
  eventClick = output<AnyEvent>();

  // Constants for capacity calculation
  private readonly EVENT_HEIGHT = 24;        // px (1.5em)
  private readonly EVENT_SPACING_XS = 4;     // px gap between events
  private readonly DAY_NUMBER_HEIGHT = 24;   // px reserved for day number
  private readonly MORE_INDICATOR_HEIGHT = 20; // px for +N more indicator

  /**
   * Computed: Overflow indicators to render
   * Returns array of indicator data with positioning
   */
  readonly overflowIndicators = computed(() => {
    const renderData = this.eventsToRender();
    const gridBounds = this.gridSync.gridBounds();

    if (gridBounds.cellWidth === 0 || gridBounds.cellHeight === 0) {
      return [];
    }

    const indicators: Array<{
      count: number;
      left: string;
      top: number;
      width: string;
      showAll: boolean;  // true = "(n) events", false = "+n more"
      hiddenEvents: AnyEvent[];  // Events to show in popover
    }> = [];

    const cellCapacity = this.calculateCellCapacity(gridBounds.cellHeight);
    const slotHeight = this.EVENT_HEIGHT + this.EVENT_SPACING_XS;

    for (const [key, info] of renderData.overflow) {
      // Calculate how many events are actually visible
      // This matches the logic in eventsToRender
      const hasOverflow = info.count > 0;
      const maxVisible = hasOverflow ? Math.max(1, cellCapacity - 1) : cellCapacity;

      const leftPercent = (info.dayIndex * 100) / 7;
      const widthPercent = 100 / 7;

      // Position indicator after the visible events
      const topPx = info.weekIndex * gridBounds.cellHeight +
        this.DAY_NUMBER_HEIGHT +
        (maxVisible * slotHeight);

      indicators.push({
        count: info.count,
        left: `${leftPercent.toFixed(4)}%`,
        top: topPx,
        width: `${widthPercent.toFixed(4)}%`,
        showAll: info.showAll || false,
        hiddenEvents: info.hiddenEvents || []
      });
    }

    return indicators;
  });

  /**
   * Computed: All events AND overflow info to render in current month view
   * Returns both rendered events and overflow tracking data
   */
  readonly eventsToRender = computed(() => {
    const events = this.eventStore.allEvents();
    const currentDate = this.calendarStore.currentDate();
    const gridBounds = this.gridSync.gridBounds();

    // Get active resources to filter events
    const activeResources = this.calendarStore.activeResources();
    const activeResourceIds = new Set(activeResources.map(r => r.id));

    // Guard: Only render if grid has been measured
    if (gridBounds.cellWidth === 0 || gridBounds.cellHeight === 0) {
      return {
        events: [],
        overflow: new Map<string, {
          count: number;
          weekIndex: number;
          dayIndex: number;
          showAll: boolean;
          hiddenEvents: AnyEvent[];  // For popover
        }>()
      };
    }

    // Filter events to only include those in the current month view
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const eventsInMonth = events.filter(event => {
      // Filter by active resources FIRST
      if (event.resourceId && !activeResourceIds.has(event.resourceId)) {
        return false; // Skip events from inactive resources
      }

      if (event.type === 'event') {
        const eventStart = event.start;
        const eventEnd = event.end;
        // Event overlaps with month if it starts before month ends AND ends after month starts
        return eventStart <= monthEnd && eventEnd >= monthStart;
      }
      return false; // Only support regular events for now
    });

    // Get cell dimensions
    const cellDimensions = {
      width: gridBounds.cellWidth,
      height: gridBounds.cellHeight
    };

    // Get calendar weeks for the month
    const weeks = getMonthCalendarGrid(currentDate);

    // Calculate cell capacity once
    const cellCapacity = this.calculateCellCapacity(cellDimensions.height);

    // Process events BY WEEK and assign slots (Google Calendar style)
    const allRenderedEvents: Array<{
      event: AnyEvent;
      renderData: any;
      color: string;
    }> = [];

    // Track overflow per week-day combination for indicators
    const overflowByWeekDay = new Map<string, {
      count: number;
      weekIndex: number;
      dayIndex: number;
      showAll: boolean;
      hiddenEvents: AnyEvent[];
    }>();

    for (const [weekIndex, week] of weeks.entries()) {
      const weekStart = week.days[0].date; // Sunday
      const weekEnd = new Date(week.days[6].date);   // Saturday
      weekEnd.setHours(23, 59, 59, 999); // Set to end of Saturday

      // Get events for this week
      const eventsInWeek = eventsInMonth.filter(event => {
        const eventStart = event.type === 'event' ? event.start : (event as any).date;
        const eventEnd = event.type === 'event' ? event.end : ((event as any).endDate || (event as any).date);
        return eventStart <= weekEnd && eventEnd >= weekStart;
      });

      // Assign slots using Tetris algorithm
      const slottedEvents = this.slotAssigner.assignSlots(eventsInWeek, weekStart);

      // Group events by day to apply capacity limits
      const eventsByDay = this.groupEventsByDay(slottedEvents);

      // Apply capacity limits per day and render
      for (const [dayIndex, dayEvents] of eventsByDay) {
        const totalEvents = dayEvents.length;
        const hasOverflow = totalEvents > cellCapacity;

        // If overflow: show (capacity - 1) events to reserve space for "+N more"
        // If no overflow: show all events up to capacity
        const maxVisible = hasOverflow ? Math.max(1, cellCapacity - 1) : cellCapacity;
        const visibleEvents = dayEvents.slice(0, maxVisible);
        const overflowCount = totalEvents - maxVisible;

        // Track overflow for this day
        if (overflowCount > 0) {
          const key = `${weekIndex}-${dayIndex}`;
          // showAll=true when we're showing ONLY the indicator (capacity=1 case)
          const showAll = maxVisible === 0;
          const hiddenEvents = dayEvents.slice(maxVisible).map(s => s.event);

          overflowByWeekDay.set(key, {
            count: overflowCount,
            weekIndex,
            dayIndex,
            showAll,
            hiddenEvents
          });
        }

        // Render visible events
        for (const slotted of visibleEvents) {
          allRenderedEvents.push({
            event: slotted.event,
            renderData: this.renderer.render(
              slotted.event,
              currentDate,
              cellDimensions,
              slotted.slotIndex,  // Pass slot index for Y positioning
              { start: weekStart, end: weekEnd } // [NEW] Pass week boundaries for clamping
            ),
            color: this.getEventColor(slotted.event)
          });
        }
      }
    }

    // Return both events and overflow data (no signal mutation!)
    return { events: allRenderedEvents, overflow: overflowByWeekDay };
  });

  /**
   * Calculates how many events can fit in a cell
   */
  private calculateCellCapacity(cellHeight: number): number {
    const availableHeight = cellHeight - this.DAY_NUMBER_HEIGHT;
    const slotHeight = this.EVENT_HEIGHT + this.EVENT_SPACING_XS;

    // Calculate total slots that fit
    const totalSlots = Math.floor((availableHeight + this.EVENT_SPACING_XS) / slotHeight);

    // Minimum 1 event should always fit
    return Math.max(1, totalSlots);
  }

  /**
   * Groups slotted events by day of week within their week
   */
  private groupEventsByDay(slottedEvents: SlottedEvent[]): Map<number, SlottedEvent[]> {
    const byDay = new Map<number, SlottedEvent[]>();

    for (const event of slottedEvents) {
      // For multi-day events, add to each day they span
      for (let day = event.dayStart; day <= event.dayEnd; day++) {
        if (!byDay.has(day)) {
          byDay.set(day, []);
        }
        byDay.get(day)!.push(event);
      }
    }

    // Sort events within each day by slot index
    byDay.forEach(events => {
      events.sort((a, b) => a.slotIndex - b.slotIndex);
    });

    return byDay;
  }

  /**
   * Gets the effective color for an event
   * Priority: event.color > resource.color > default
   */
  private getEventColor(event: AnyEvent): string {
    // If event has explicit color, use it
    if (event.color) {
      return event.color;
    }

    // If event belongs to a resource, inherit resource color
    if (event.resourceId) {
      const resource = this.eventStore.getResource(event.resourceId);
      if (resource?.color) {
        return resource.color;
      }
    }

    // Default fallback
    return '#0860c4';
  }

  /**
   * Handles click on overflow indicator to show popover with hidden events
   */
  onIndicatorClick(element: HTMLElement, hiddenEvents: AnyEvent[]): void {
    // Close existing overlay if any
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    // Create position strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(element)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 }
      ]);

    // Create overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    // Handle backdrop click
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });

    // Handle ESC key
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.closeOverlay();
      }
    });

    // Attach popover component
    const portal = new ComponentPortal(EventOverflowPopover);
    const componentRef = this.overlayRef.attach(portal);
    componentRef.setInput('events', hiddenEvents);

    // Listen to close event from popover
    componentRef.instance.closePopover.subscribe(() => {
      this.closeOverlay();
    });

    // Listen to event click from popover
    componentRef.instance.eventClick.subscribe((event: AnyEvent) => {
      console.log('[MonthView] Received click from popover for event:', event.title);
      this.onEventClick(event);
    });
  }

  /**
   * Handles event click from grid or popover
   * Uses direct emitter if available (from mglon-event), otherwise falls back to month view output
   */
  onEventClick(event: AnyEvent): void {
    // Check if event has a direct emitter (registered via mglon-event)
    if (event._clickEmitter) {
      event._clickEmitter.emit(event);
    } else {
      // Fallback to MonthView output (wrapper level)
      this.eventClick.emit(event);
    }
  }

  /**
   * Closes the overflow popover overlay
   */
  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  constructor() {
    // Set up grid synchronization after view init
    afterNextRender(() => {
      const grid = this.gridElement()?.nativeElement;

      if (grid) {
        // Observe grid for resize
        this.gridSync.observeGrid(grid, (rect) => ({
          width: rect.width / 7,  // 7 columns (days per week)
          height: rect.height / 6  // 6 rows (always consistent)
        }));
      }
    });
  }
}
