The `mglon-schedule` component is the core of the Mglon Scheduler library. It provides a powerful, signal-based calendar view with support for multiple view modes, resources, and event types.

## Installation

```bash
pnpm add ng-scheduler
```

## Basic Usage

Import the `Schedule` component and use it in your template:

```typescript
import { Schedule } from 'ng-scheduler'

@Component({
  imports: [Schedule],
  template: `
    <mglon-schedule [config]="config">
      <mglon-resource id="1" name="Resource 1">
        <mglon-event
          id="e1"
          title="Team Meeting"
          [startDate]="eventStart"
          [endDate]="eventEnd">
        </mglon-event>
      </mglon-resource>
    </mglon-schedule>
  `
})
export class MyComponent {
  config = { viewMode: 'month' }
  eventStart = new Date('2025-01-15T10:00:00')
  eventEnd = new Date('2025-01-15T11:00:00')
}
```

## Features

- **Month & Week Views**: Switch between different calendar perspectives
- **Resource Grouping**: Organize events by resource
- **Drag & Drop**: Move events with pointer events
- **Resizing**: Adjust event duration by dragging edges
- **Recurrence**: Support for recurring events with `rrule`
- **All-Day Events**: Special styling for all-day events
- **Adaptive Colors**: Automatic color scheme generation

## Configuration

The schedule accepts a `config` input with the following options:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `viewMode` | `'month' \| 'week'` | `'month'` | Current view mode |
| `startOfWeek` | `0-6` | `0` | First day of the week (0 = Sunday) |
| `locale` | `string` | `'en-US'` | Locale for date formatting |

## Next Steps

- Learn about [Events](/docs/getting-started/events)
- Explore [Resources](/docs/getting-started/resources)
- Customize with [Theming](/docs/customization/theming)
