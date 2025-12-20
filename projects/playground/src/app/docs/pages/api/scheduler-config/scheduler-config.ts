import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTableComponent, ApiProperty } from '../../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../../shared/code-block/code-block';

@Component({
  selector: 'app-scheduler-config-doc',
  standalone: true,
  imports: [CommonModule, ApiTableComponent, CodeBlockComponent],
  templateUrl: './scheduler-config.html'
})
export class SchedulerConfigDocComponent {
  properties: ApiProperty[] = [
    { name: 'initialDate', type: 'Date | string', defaultValue: 'new Date()', description: 'Initial date to display. Accepts Date object or ISO string.' },
    { name: 'initialView', type: 'ViewMode', defaultValue: "'month'", description: 'Initial view mode when loading the scheduler.' },
    { name: 'slotDuration', type: 'number', defaultValue: '30', description: 'Duration of each time slot in minutes (15, 30, 60).' },
    { name: 'dayStartHour', type: 'number', defaultValue: '0', description: 'Start hour of the day (0-23). Useful for hiding early morning hours.' },
    { name: 'dayEndHour', type: 'number', defaultValue: '23', description: 'End hour of the day (0-23).' },
    { name: 'resourceSidebarWidth', type: 'number', defaultValue: '200', description: 'Width of the resource sidebar column in pixels.' },
    { name: 'allowOverlaps', type: 'boolean', defaultValue: 'true', description: 'If true, visually groups overlapping events.' },
    { name: 'locale', type: 'string', defaultValue: "'en'", description: 'Language code (e.g., "es", "en-US").' },
    { name: 'weekStartsOn', type: '0 | 1', defaultValue: '0', description: 'Day the week starts on (0=Sunday, 1=Monday).' },
    { name: 'theme', type: 'string', defaultValue: 'undefined', description: 'Base CSS class to apply predefined themes (e.g., "theme-google", "theme-dark").' },
    { name: 'height', type: 'string', defaultValue: "'100%'", description: 'Height of the calendar (e.g., "auto", "100%", "600px").' },
    { name: 'views', type: 'ViewMode[]', defaultValue: "['month', 'week', 'day', 'resource']", description: 'Array of view modes to enable.' },
    { name: 'backgroundSelection', type: 'boolean', defaultValue: 'true', description: 'Enable or disable background selection feature.' },
    { name: 'showNowIndicator', type: 'boolean', defaultValue: 'true', description: 'Show the current time indicator.' },
    { name: 'editable', type: 'boolean', defaultValue: 'true', description: 'Enable or disable editing options (like the add button in header).' },
  ];

  usageExample = `
const config: SchedulerConfig = {
  initialDate: new Date('2024-12-20'),
  initialView: 'week',
  slotDuration: 30,
  dayStartHour: 8,
  dayEndHour: 18,
  locale: 'es',
  weekStartsOn: 1,
  views: ['month', 'week', 'day'],
  backgroundSelection: true,
  editable: true
};
  `.trim();
}
