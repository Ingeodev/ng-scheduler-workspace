import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Schedule,
  SchedulerConfig,
  GridUIConfig,
  HeaderUIConfig,
  SidebarUIConfig,
  ResourceEvents,
  Event,
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
    Event,
    ResourceEvents,
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
    editable: true,
  };

  eventStart = new Date()
  eventEnd = new Date(new Date().setHours(new Date().getHours() + 1))

  // Multi-week event: Dec 26 to Jan 5
  event2Start = new Date(2025, 11, 26) // Dec 26, 2025
  event2End = new Date(2026, 0, 5)     // Jan 5, 2026

  // Single day event
  event3Start = new Date(2025, 11, 24, 10, 0)
  event3End = new Date(2025, 11, 24, 12, 0)

  // Multi-day event within same week
  event4Start = new Date(2025, 11, 27, 9, 0)
  event4End = new Date(2025, 11, 29, 17, 0)

  // ============================================
  // Additional events for overflow testing
  // Multiple events on Dec 25 (Christmas Day)
  // ============================================
  event5Start = new Date(2025, 11, 25, 8, 0)
  event5End = new Date(2025, 11, 23, 9, 0)

  event6Start = new Date(2025, 11, 25, 10, 0)
  event6End = new Date(2025, 11, 25, 11, 0)

  event7Start = new Date(2025, 11, 25, 12, 0)
  event7End = new Date(2025, 11, 25, 13, 0)

  event8Start = new Date(2025, 11, 25, 14, 0)
  event8End = new Date(2025, 11, 25, 15, 0)

  event9Start = new Date(2025, 11, 25, 16, 0)
  event9End = new Date(2025, 11, 25, 17, 0)



  // UI Configuration Examples
  gridUIConfig: Partial<GridUIConfig> = {
    eventSlots: {
      rounded: 'sm'  // Options: 'none' | 'sm' | 'full'
    }
  };

  headerUIConfig: Partial<HeaderUIConfig> = {
    buttonGroup: {
      appearance: 'solid',
      rounded: 'full',        // Options: 'none' | 'sm' | 'md' | 'lg' | 'full'
      density: 'comfortable' // Options: 'compact' | 'comfortable'
    },
    iconButtons: {
      rounded: 'none'
    },
    todayButton: {
      rounded: 'full',
      appearance: 'ghost'   // Options: 'solid' | 'outline' | 'ghost'
    }
  };

  sidebarUIConfig: Partial<SidebarUIConfig> = {
    resourceItems: {
      rounded: 'none',
      density: 'comfortable'
    }
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
    views: ['month', 'week', 'day', 'resource'],
    initialDate: new Date(),
    resources: [
      { id: 'resource-1', name: 'Conference Room A', color: '#0860c4' },
      { id: 'resource-2', name: 'Conference Room B', color: '#e91e63' }
    ]
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
  ];

  outputs: ApiProperty[] = [
    {
      name: 'dateRangeChange',
      description: 'Emitted when the visible date range changes (navigating).',
      type: '{ start: Date; end: Date }'
    },
    {
      name: 'viewChange',
      description: 'Emitted when the view mode changes.',
      type: 'ViewMode',
      typeLink: '/docs/api/view-mode'
    },
    {
      name: 'resourceShow',
      description: 'Emitted when a resource is activated/shown.',
      type: 'string'
    },
    {
      name: 'resourceHide',
      description: 'Emitted when a resource is deactivated/hidden.',
      type: 'string'
    }
  ];


  onResourceShow(resourceId: string): void {
    console.log('Resource shown:', resourceId);
  }

  onResourceHide(resourceId: string): void {
    console.log('Resource hidden:', resourceId);
  }
}

