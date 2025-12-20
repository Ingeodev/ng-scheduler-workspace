import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Schedule,
  SchedulerConfig,
  ResourceComponent,
  EventComponent,
  AllDayEventComponent,
  RecurrentEventComponent
} from 'ng-scheduler';
import { ApiTableComponent, ApiProperty } from '../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../shared/code-block/code-block';
import { ExampleViewerComponent } from '../../shared/example-viewer/example-viewer';

@Component({
  selector: 'app-schedule-doc',
  standalone: true,
  imports: [
    CommonModule,
    Schedule,
    ResourceComponent, // Added ResourceComponent
    EventComponent,
    AllDayEventComponent,
    RecurrentEventComponent,
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

  // Sample event dates
  event1Start = new Date(2024, 11, 20, 10, 0); // Dec 20, 2024 10:00 AM
  event1End = new Date(2024, 11, 20, 11, 0);   // Dec 20, 2024 11:00 AM

  event2Start = new Date(2024, 11, 21, 14, 0); // Dec 21, 2024 2:00 PM
  event2End = new Date(2024, 11, 21, 15, 38);  // Dec 21, 2024 3:30 PM

  event3Start = new Date(2024, 11, 22, 9, 0);  // Dec 22, 2024 9:00 AM
  event3End = new Date(2024, 11, 22, 10, 30);  // Dec 22, 2024 10:30 AM

  basicExampleCode = `
import { Component } from '@angular/core';
import {
  Schedule,
  SchedulerConfig,
  ResourceComponent,
  EventComponent
} from 'ng-scheduler';

@Component({
  template: \`
    <div style="height: 600px;">
      <mglon-schedule [config]="config">
        <!-- Resources contain events -->
        <mglon-resource
          id="resource-1"
          name="Conference Room A"
          color="#0860c4">

          <mglon-event
            id="evt-1"
            title="Team Standup"
            [start]="new Date(2024, 11, 20, 10, 0)"
            [end]="new Date(2024, 11, 20, 11, 0)">
          </mglon-event>

          <mglon-event
            id="evt-2"
            title="Client Meeting"
            [start]="new Date(2024, 11, 21, 14, 0)"
            [end]="new Date(2024, 11, 21, 15, 30)">
          </mglon-event>
        </mglon-resource>

        <mglon-resource
          id="resource-2"
          name="Conference Room B"
          color="#e91e63">

          <mglon-event
            id="evt-3"
            title="Design Review"
            [start]="new Date(2024, 11, 22, 9, 0)"
            [end]="new Date(2024, 11, 22, 10, 30)">
          </mglon-event>
        </mglon-resource>
      </mglon-schedule>
    </div>
  \`,
  imports: [Schedule, ResourceComponent, EventComponent]
})
export class MyComponent {
  config: SchedulerConfig = {
    initialView: 'month',
    views: ['month', 'week', 'day', 'resource'],
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
