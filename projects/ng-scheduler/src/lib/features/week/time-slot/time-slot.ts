import { Component, input } from '@angular/core';
import { TimeSlot } from '../../../shared/helpers';

/**
 * Component representing a single 30-minute time slot in the week view.
 * 
 * Displays the time label (e.g., "09:00") only for the first column (time gutter).
 * Each slot has a minimum height of 50px and can contain events.
 * 
 * @example
 * ```html
 * <mglon-time-slot 
 *   [slot]="timeSlot" 
 *   [showTimeLabel]="true">
 * </mglon-time-slot>
 * ```
 */
@Component({
  selector: 'mglon-time-slot',
  standalone: true,
  imports: [],
  templateUrl: './time-slot.html',
  styleUrl: './time-slot.scss',
})
export class TimeSlotComponent {
  /**
   * The time slot data to display
   */
  readonly slot = input.required<TimeSlot>();

  /**
   * Whether to show the time label (only true for first column - time gutter)
   */
  readonly showTimeLabel = input<boolean>(false);
}
