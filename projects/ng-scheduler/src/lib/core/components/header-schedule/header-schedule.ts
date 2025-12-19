import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ViewMode } from '../../models/config-schedule';

@Component({
  selector: 'mglon-header-schedule',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header-schedule.html',
  styleUrl: './header-schedule.scss',
})
export class HeaderSchedule {
  // Inputs
  readonly title = input.required<string>();
  readonly activeView = input.required<ViewMode>();
  readonly views = input<ViewMode[]>(['month', 'week', 'day', 'resource']);

  // Outputs
  readonly next = output<void>();
  readonly prev = output<void>();
  readonly today = output<void>();
  readonly viewChange = output<ViewMode>();
  readonly add = output<void>();
}
