import { Component, input, output } from '@angular/core';
import { ResourceModel } from '../../../core/models/event-model';
import { Avatar } from '../../../shared/components/avatar/avatar';

@Component({
  selector: 'mglon-resource-item-schedule',
  standalone: true,
  imports: [Avatar],
  templateUrl: './resource-item-schedule.html',
  styleUrl: './resource-item-schedule.scss',
})
export class ResourceItemSchedule {
  /** Resource to display */
  readonly resource = input.required<ResourceModel>();

  /** Emitted when the resource is clicked (for toggle) */
  readonly toggle = output<string>();

  onToggle() {
    this.toggle.emit(this.resource().id);
  }
}
