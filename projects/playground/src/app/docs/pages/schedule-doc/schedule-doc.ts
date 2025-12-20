import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Schedule, SchedulerConfig } from 'ng-scheduler';
import { ApiTableComponent, ApiProperty } from '../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../shared/code-block/code-block';
import { ExampleViewerComponent } from '../../shared/example-viewer/example-viewer';

@Component({
  selector: 'app-schedule-doc',
  standalone: true,
  imports: [
    CommonModule,
    Schedule,
    ApiTableComponent,
    CodeBlockComponent,
    ExampleViewerComponent
  ],
  templateUrl: './schedule-doc.html'
})
export class ScheduleDocComponent {
  config: SchedulerConfig = {
    initialView: 'month',
    views: ['month', 'week', 'day', 'resource'],
    initialDate: new Date(),
    editable: true
  };

  basicExampleCode = `
import { Component } from '@angular/core';
import { Schedule, SchedulerConfig } from 'ng-scheduler';

@Component({
  template: \`
    <div style="height: 600px;">
      <mglon-schedule [config]="config"></mglon-schedule>
    </div>
  \`,
  imports: [Schedule]
})
export class MyComponent {
  config: SchedulerConfig = {
    initialView: 'month',
    views: ['month', 'week', 'day'],
    initialDate: new Date()
  };
}
  `;

  stylingCode = `
// Global Theme Overrides
:root {
  --mglon-schedule-primary: #3f51b5;
  --mglon-schedule-surface: #ffffff;
  --mglon-schedule-border-radius-md: 8px;
  
  // Font
  --mglon-schedule-font-family: 'Inter', sans-serif;
}
  `;

  inputs: ApiProperty[] = [
    {
      name: 'config',
      description: 'Configuration object to set up the view, date, and behavior.',
      type: 'SchedulerConfig',
      typeLink: '/docs/api/scheduler-config',
      defaultValue: 'DEFAULT_CONFIG'
    },
    {
      name: 'events',
      description: 'List of events to display on the calendar.',
      type: 'EventModel[]',
      typeLink: '/docs/api/event-model',
      defaultValue: '[]'
    },
  ];

  outputs: ApiProperty[] = [
    {
      name: 'eventClick',
      description: 'Emitted when an event is clicked.',
      type: 'EventModel',
      typeLink: '/docs/api/event-model'
    },
    {
      name: 'dateChange',
      description: 'Emitted when the visible date range changes (navigating).',
      type: 'Date'
    },
    {
      name: 'viewChange',
      description: 'Emitted when the view mode changes.',
      type: 'ViewMode',
      typeLink: '/docs/api/view-mode'
    },
  ];
}
