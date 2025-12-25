import { Component, computed, inject, input } from '@angular/core';
import { CalendarDay } from '../../../shared/helpers';
import { MonthDayIndicator } from "../month-day-indicator/month-day-indicator";
import { CalendarStore } from '../../../core/store/calendar.store';

@Component({
  selector: 'mglon-month-cell',
  standalone: true,
  imports: [MonthDayIndicator],
  templateUrl: './month-cell.html',
  styleUrl: './month-cell.scss',
})
export class MonthCell {
  private readonly store = inject(CalendarStore);

  // Input for the day data
  readonly day = input.required<CalendarDay>();

  /** Whether a slot is currently being dragged over this cell */
  readonly isDragOver = computed(() => {
    const hoverDate = this.store.dragState().hoverDate;
    if (!hoverDate) return false;
    return hoverDate.getTime() === this.day().date.getTime();
  });

  /**
   * Handles dragenter event to highlight the cell
   */
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.store.setDragHover(this.day().date);
    this.store.updateDraggedEventPosition();
  }

  /**
   * Handles dragleave event to remove the highlight
   */
  onDragLeave(event: DragEvent): void {
    // Only clear if we are leaving the current hover date
    if (this.isDragOver()) {
      // We don't necessarily want to clear it here because entering the next cell
      // will update it. But for safety when leaving the grid area:
    }
  }

  /**
   * Handles dragover event. Must prevent default to allow drop.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * Handles drop event
   */
  onDrop(event: DragEvent): void {
    const dragState = this.store.dragState();

    if (dragState.eventId) {
      console.log('--- Drop Event (from Store) ---');
      console.log('Target Day:', this.day().date);
      console.log('Event ID:', dragState.eventId);
      console.log('Grabbed Date:', dragState.grabDate);

      // Calculate offset and update store
    }

    this.store.clearDragState();
  }
}
