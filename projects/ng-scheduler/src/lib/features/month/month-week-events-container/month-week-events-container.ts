import { Component, input } from '@angular/core';
import { SlotModel } from '../../../core/models/slot.model';
import { MonthSlot } from '../month-slot/month-slot';

@Component({
  selector: 'mglon-month-week-events-container',
  imports: [MonthSlot],
  templateUrl: './month-week-events-container.html',
  styleUrl: './month-week-events-container.scss',
  host: {
    '[style.position]': '"relative"',
    '[style.width]': '"100%"',
    '[style.height]': '"100%"',
  }
})
export class MonthWeekEventsContainer {
  readonly slots = input.required<SlotModel[]>();
}
