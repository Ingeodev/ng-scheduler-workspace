import { Component, inject, computed, viewChild, ElementRef, afterNextRender, output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeekHeader } from '../week-header/week-header';
import { WeekGrid } from '../week-grid/week-grid';
import { CalendarStore } from '../../../core/store/calendar.store';
import { EventStore } from '../../../core/store/event.store';
import { GridSyncService } from '../../../core/services/grid-sync.service';
import { EventRendererFactory } from '../../../core/rendering/event-renderer.factory';
import { WeekViewRenderer } from '../../../core/rendering/week-view.renderer';
import { EventRenderComponent } from '../../../shared/components/event-render/event-render';
import { AnyEvent } from '../../../core/models/event';
import { SelectionResult } from '../../../core/background-selection/selectable/selectable.directive';
import { getWeekDays } from '../../../shared/helpers';

/**
 * Week view container component.
 */
@Component({
  selector: 'mglon-week-view',
  standalone: true,
  imports: [WeekHeader, WeekGrid, EventRenderComponent],
  templateUrl: './week-view.html',
  styleUrl: './week-view.scss',
  animations: [
    trigger('weekTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX({{ direction }}%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { params: { direction: 0 } })
    ])
  ]
})
export class WeekView {
  readonly store = inject(CalendarStore);
  readonly eventStore = inject(EventStore);
  readonly gridSync = inject(GridSyncService);

  // ============================================
  // OUTPUT EVENTS
  // ============================================

  /** Emitted when selection starts */
  readonly selectionStart = output<SelectionResult>();

  /** Emitted while selecting */
  readonly selectionChange = output<SelectionResult>();

  /** Emitted when selection ends */
  readonly selectionEnd = output<SelectionResult>();

  // Get week grid element reference
  readonly gridElement = viewChild(WeekGrid, { read: ElementRef });

  // Event renderer for this view
  private readonly renderer = EventRendererFactory.getRenderer('week') as WeekViewRenderer;

  readonly animationState = computed(() => {
    const date = this.store.currentDate();
    return this.getWeekNumber(date);
  });

  /**
   * Computed: All events to render in current week view
   */
  readonly eventsToRender = computed(() => {
    const events = this.eventStore.allEvents();
    const currentDate = this.store.currentDate();
    const gridBounds = this.gridSync.gridBounds();

    // Get active resources to filter events
    const activeResources = this.store.activeResources();
    const activeResourceIds = new Set(activeResources.map(r => r.id));

    // Guard: Only render if grid has been measured
    if (gridBounds.cellWidth === 0) {
      return [];
    }

    // Calculate week range
    const weekDays = getWeekDays(currentDate);
    const weekStart = weekDays[0].date;
    const weekEnd = new Date(weekDays[6].date);
    weekEnd.setHours(23, 59, 59, 999);

    const eventsInWeek = events.filter(event => {
      // Filter by active resources FIRST
      if (event.resourceId && !activeResourceIds.has(event.resourceId)) {
        return false; // Skip events from inactive resources
      }

      if (event.type === 'event') {
        const eventStart = event.start;
        const eventEnd = event.end;
        return eventStart <= weekEnd && eventEnd >= weekStart;
      }
      return false;
    });

    // Pass column width (cellWidth from sync service)
    const cellDimensions = {
      width: gridBounds.cellWidth,
      height: 0 // Not used for height in week view, handled by constant
    };

    return eventsInWeek.map(event => ({
      event,
      renderData: this.renderer.render(event, currentDate, cellDimensions),
      color: this.getEventColor(event)
    }));
  });

  private getEventColor(event: AnyEvent): string {
    if (event.color) return event.color;
    if (event.resourceId) {
      const resource = this.eventStore.getResource(event.resourceId);
      if (resource?.color) return resource.color;
    }
    return '#0860c4';
  }

  constructor() {
    afterNextRender(() => {
      const gridComponent = this.gridElement();
      if (gridComponent) {
        const grid = gridComponent.nativeElement as HTMLElement;
        this.gridSync.observeGrid(grid, (rect) => ({
          // Subtract: time column (60px) + 6 borders between 7 columns (6px)
          width: (rect.width - 60 - 6) / 7,
          height: rect.height
        }));
      }
    });
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
