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

  eventStart = new Date();
  eventEnd = new Date(new Date().setHours(new Date().getHours() + 1));



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

