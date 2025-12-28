import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from '../../../shared/code-block/code-block';

@Component({
  selector: 'app-view-mode-doc',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent],
  templateUrl: './view-mode.html'
})
export class ViewModeDocComponent {
  typeDefinition = `export type ViewMode = 'day' | 'week' | 'month' | 'resource' | 'list';`;

  viewModes = [
    { value: "'day'", description: 'Single day view showing hourly time slots.' },
    { value: "'week'", description: 'Week view displaying 7 days with time grid.' },
    { value: "'month'", description: 'Month view showing all days in a calendar grid.' },
    { value: "'resource'", description: 'Resource timeline view showing events across resources.' },
    { value: "'list'", description: 'List view showing events in a linear list format.' },
  ];
}
