import { Component, inject, computed, effect, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthHeader } from '../month-header/month-header';
import { MonthGrid } from '../month-grid/month-grid';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';
import { EventRenderComponent } from '../../../shared/components/event-render/event-render';
import { EventRendererFactory } from '../../../core/rendering/event-renderer.factory';
import { GridSyncService } from '../../../core/services/grid-sync.service';
import { AnyEvent } from '../../../core/models/event';

@Component({
  selector: 'mglon-month-view',
  standalone: true,
  imports: [CommonModule, MonthHeader, MonthGrid, EventRenderComponent],
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

  /**
   * Computed: All events to render in current month view
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
      return [];
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

    // Get real cell dimensions from grid
    const cellDimensions = {
      width: gridBounds.cellWidth,
      height: gridBounds.cellHeight
    };

    // Render each event using MonthViewRenderer with actual dimensions
    return eventsInMonth.map(event => ({
      event,
      renderData: this.renderer.render(event, currentDate, cellDimensions),
      color: this.getEventColor(event) // Resolve color with resource inheritance
    }));
  });

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
