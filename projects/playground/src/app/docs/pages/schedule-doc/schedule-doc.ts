import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Schedule,
  SchedulerConfig,
  ResourceComponent,
  EventComponent,
  AllDayEventComponent,
  RecurrentEventComponent,
  GridUIConfig,
  HeaderUIConfig,
  SidebarUIConfig
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

  // UI Configuration Examples
  gridUIConfig: Partial<GridUIConfig> = {
    eventSlots: {
      rounded: 'full'  // Options: 'none' | 'sm' | 'full'
    },
    overflowIndicator: {
      appearance: 'outline',  // Options: 'ghost' | 'outline' | 'solid'
      rounded: 'full'           // Options: 'none' | 'sm' | 'md' | 'full'
    }
  };

  headerUIConfig: Partial<HeaderUIConfig> = {
    buttonGroup: {
      appearance: 'outline',
      rounded: 'full',        // Options: 'none' | 'sm' | 'md' | 'lg' | 'full'
      density: 'compact' // Options: 'compact' | 'comfortable'
    },
    iconButtons: {
      rounded: 'full'
    },
    todayButton: {
      rounded: 'md',
      appearance: 'ghost'   // Options: 'solid' | 'outline' | 'ghost'
    }
  };

  sidebarUIConfig: Partial<SidebarUIConfig> = {
    resourceItems: {
      rounded: 'full',
      density: 'comfortable'
    }
  };

  // Sample event dates
  event1Start = new Date(2025, 11, 20, 10, 0); // Dec 20, 2025 (Saturday)
  event1End = new Date(2025, 11, 23, 11, 0);   // Dec 23, 2025 (Tuesday)

  event2Start = new Date(2025, 11, 20, 14, 0); // Dec 21, 2024 2:00 PM
  event2End = new Date(2025, 11, 21, 15, 38);  // Dec 21, 2024 3:30 PM

  event3Start = new Date(2025, 11, 20, 9, 0);  // Dec 22, 2025 9:00 AM
  event3End = new Date(2025, 11, 21, 10, 30);  // Dec 22, 2025 10:30 AM

  // Additional events on SAME DAY as event1 (Dec 20) for Tetris demo
  event4Start = new Date(2025, 11, 20, 14, 0); // Dec 20, 2025 2:00 PM
  event4End = new Date(2025, 11, 20, 15, 0);   // Dec 20, 2025 3:00 PM

  event5Start = new Date(2025, 11, 20, 16, 30); // Dec 20, 2025 4:30 PM  
  event5End = new Date(2025, 11, 20, 17, 30);   // Dec 20, 2025 5:30 PM

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

  uiConfigCode = `
import { GridUIConfig, HeaderUIConfig, SidebarUIConfig } from 'ng-scheduler';

// Configure grid area (event slots and overflow indicators)
gridUI: Partial<GridUIConfig> = {
  eventSlots: {
    rounded: 'sm'  // 'none' | 'sm' | 'full'
  },
  overflowIndicator: {
    appearance: 'outline',  // 'ghost' | 'outline' | 'solid'
    rounded: 'sm'           // 'none' | 'sm' | 'md' | 'full'
  }
};

// Configure header area (button group, navigation, today button)
headerUI: Partial<HeaderUIConfig> = {
  buttonGroup: {
    rounded: 'md',          // 'none' | 'sm' | 'md' | 'lg' | 'full'
    density: 'comfortable'  // 'compact' | 'comfortable'
  },
  iconButtons: {
    rounded: 'md'
  },
  todayButton: {
    rounded: 'md',
    appearance: 'ghost'     // 'solid' | 'outline' | 'ghost'
  }
};

// Configure sidebar area (resource items)
sidebarUI: Partial<SidebarUIConfig> = {
  resourceItems: {
    rounded: 'sm',
    density: 'comfortable'
  }
};

// Use in template
<mglon-schedule 
  [config]="config"
  [gridUI]="gridUI"
  [headerUI]="headerUI" 
  [sidebarUI]="sidebarUI">
  <!-- ... -->
</mglon-schedule>
  `;

  stylingCode = `
// Global Theme Overrides
:root {
  --mglon-schedule-primary: #3f51b5;
  --mglon-schedule-surface: #ffffff;
  --mglon-schedule-radius-sm: 4px;
  --mglon-schedule-radius-md: 8px;
  --mglon-schedule-radius-lg: 12px;
  --mglon-schedule-radius-full: 9999px;
  
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

  onResourceShow(resourceId: string): void {
    console.log('Resource shown:', resourceId);
    alert(`Resource shown: ${resourceId}`);
  }

  onResourceHide(resourceId: string): void {
    console.log('Resource hidden:', resourceId);
    alert(`Resource hidden: ${resourceId}`);
  }

  eventClickHandler(event: any): void {
    console.log('[Playground] 🎯 EVENT-SPECIFIC handler (highest priority)', event);
    alert(`🎯 EVENT-SPECIFIC Handler\n\nEvent: ${event.title}\nID: ${event.id}\nThis is the most specific handler!`);
  }
}
