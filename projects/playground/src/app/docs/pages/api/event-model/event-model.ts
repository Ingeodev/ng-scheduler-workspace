import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTableComponent, ApiProperty } from '../../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../../shared/code-block/code-block';

@Component({
  selector: 'app-event-model-doc',
  standalone: true,
  imports: [CommonModule, ApiTableComponent, CodeBlockComponent],
  templateUrl: './event-model.html'
})
export class EventModelDocComponent {
  properties: ApiProperty[] = [
    { name: 'id', type: 'string', description: 'Unique identifier for the event.' },
    { name: 'resourceId', type: 'string', description: 'Foreign key: ID of the resource this event belongs to (optional).' },
    { name: 'title', type: 'string', description: 'Display title of the event.' },
    { name: 'description', type: 'string', description: 'Additional description or notes for the event.' },
    { name: 'tags', type: 'string[]', description: 'Tags for filtering and styling.' },
    { name: 'start', type: 'Date', description: 'Start date and time of the event.' },
    { name: 'end', type: 'Date', description: 'End date and time of the event.' },
    { name: 'isAllDay', type: 'boolean', description: 'Whether this is an all-day event.' },
    { name: 'type', type: 'EventType', description: 'Visual/logical type of the event.' },
    { name: 'recurrenceRule', type: 'RecurrenceRule', description: 'Rule defining how the event recurs (see RecurrenceRule interface).' },
    { name: 'recurrenceException', type: 'Date[]', description: 'Dates to exclude from the recurrence pattern.' },
    { name: 'isReadOnly', type: 'boolean', description: 'If true, the event cannot be edited.' },
    { name: 'isBlocked', type: 'boolean', description: 'If true, the event is visually blocked (e.g., maintenance).' },
    { name: 'metadata', type: 'any', description: 'Flexible user-defined data.' },
  ];

  usageExample = `
const event: EventModel = {
  id: 'event-1',
  resourceId: 'room-a',
  title: 'Team Meeting',
  description: 'Weekly sync meeting',
  start: new Date('2024-12-20T10:00:00'),
  end: new Date('2024-12-20T11:00:00'),
  type: 'event',
  tags: ['meeting', 'important'],
  isReadOnly: false
};
  `.trim();
}
