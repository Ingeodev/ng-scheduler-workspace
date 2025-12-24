import { Injectable, inject, NgZone, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AnyEvent } from '../models/event';
import { GridSyncService } from './grid-sync.service';
import { CalendarStore } from '../store/calendar.store';
import { EventStore } from '../store/event.store';

@Injectable({
  providedIn: 'root'
})
export class EventResizeService implements OnDestroy {
  private gridSync = inject(GridSyncService);
  private calendarStore = inject(CalendarStore);
  private eventStore = inject(EventStore);
  private document = inject(DOCUMENT);
  private zone = inject(NgZone);

  private isResizing = false;
  private currentEvent: AnyEvent | null = null;
  private currentSide: 'left' | 'right' | 'top' | 'bottom' | null = null;

  startResize(event: AnyEvent, side: 'left' | 'right' | 'top' | 'bottom') {
    if (this.isResizing) return;
    this.isResizing = true;
    this.currentEvent = event;
    this.currentSide = side;
    console.log('Resize Start', side);
  }

  handleMove(e: MouseEvent) {
    if (!this.isResizing || !this.currentEvent || !this.currentSide) return;

    // Calculate new date based on mouse position
    // We need to know where the mouse    // Calculate new date based on mouse position
    const gridElement = this.document.querySelector('.week-view__grid') as HTMLElement ||
      this.document.querySelector('.mglon-month-view__grid-container') as HTMLElement ||
      this.document.querySelector('.month-view__grid') as HTMLElement;

    if (!gridElement) {
      console.warn('[EventResizeService] Grid element not found. Selectors checked: .week-view__grid, .mglon-month-view__grid-container');
      return;
    }

    const rect = gridElement.getBoundingClientRect();
    const x = e.clientX - rect.left + gridElement.scrollLeft;
    const y = e.clientY - rect.top + gridElement.scrollTop;

    // Determine view mode
    const viewMode = this.calendarStore.viewMode();
    const currentDate = this.calendarStore.currentDate();

    const newDate = this.gridSync.positionToDate(x, y, viewMode as any, currentDate);

    console.log('Resizing:', newDate, 'Side:', this.currentSide);

    // Update event
    // Ensure we run in zone if we are coming from outside (though likely inside)
    this.zone.run(() => {
      if (this.currentEvent && this.currentSide) {
        this.updateEvent(this.currentEvent, this.currentSide as string, newDate);
      }
    });
  }

  stopResize() {
    if (!this.isResizing) return;
    console.log('Resize Stop');
    this.isResizing = false;
    this.currentEvent = null;
    this.currentSide = null;
  }

  private updateEvent(event: AnyEvent, side: string, newDate: Date) {
    if (event.type !== 'event') return;

    // Clone event to avoid direct mutation issues if store expects immutable
    const updatedEvent = { ...event };

    if (side === 'left' || side === 'top') {
      // Modifying Start
      // Ensure start < end
      if (newDate < updatedEvent.end) {
        updatedEvent.start = newDate;
      }
    } else if (side === 'right' || side === 'bottom') {
      // Modifying End
      // Ensure end > start
      if (newDate > updatedEvent.start) {
        updatedEvent.end = newDate;
      }
    }

    // Update store
    this.eventStore.updateEvent(updatedEvent.id, updatedEvent);
  }

  ngOnDestroy() {
    this.stopResize();
  }
}
