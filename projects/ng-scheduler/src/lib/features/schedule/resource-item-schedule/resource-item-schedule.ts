import { Component, input, output } from '@angular/core';
import { ResourceModel } from '../../../core/models/resource';
import { Avatar } from '../../../shared/components/avatar/avatar';

@Component({
  selector: 'mglon-resource-item-schedule',
  standalone: true,
  imports: [Avatar],
  templateUrl: './resource-item-schedule.html',
  styleUrl: './resource-item-schedule.scss',
  host: {
    '[attr.rounded]': 'rounded()',
    '[attr.density]': 'density()'
  }
})
export class ResourceItemSchedule {
  /** Resource to display */
  readonly resource = input.required<ResourceModel>();

  /** Border radius for resource item */
  readonly rounded = input<'none' | 'sm' | 'md' | 'lg' | 'full'>('sm');

  /** Density/spacing for resource item */
  readonly density = input<'compact' | 'comfortable'>('comfortable');

  /** Emitted when the resource is clicked (for toggle) */
  readonly toggle = output<string>();

  onToggle() {
    this.toggle.emit(this.resource().id);
  }
}
