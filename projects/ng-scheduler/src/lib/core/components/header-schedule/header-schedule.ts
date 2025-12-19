import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ViewMode } from '../../models/config-schedule';
import { IconName } from '../../../shared/components/icon/icon-set';
import { ButtonGroupComponent } from '../../../shared/components/buttons/button-group/button-group';
import { ButtonComponent } from '../../../shared/components/buttons/button/button';
import { IconButtonComponent } from '../../../shared/components/buttons/icon-button/icon-button';

@Component({
  selector: 'mglon-header-schedule',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonGroupComponent, ButtonComponent, IconButtonComponent],
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

  readonly viewIcons: Record<ViewMode, IconName> = {
    'month': 'calendar-month',
    'week': 'calendar-week',
    'day': 'calendar-day',
    'resource': 'calendar-week', // Fallback
    'list': 'calendar-month' // Fallback
  };
}
