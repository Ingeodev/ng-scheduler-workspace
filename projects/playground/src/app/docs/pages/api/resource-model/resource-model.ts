import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTableComponent, ApiProperty } from '../../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../../shared/code-block/code-block';

@Component({
  selector: 'app-resource-model-doc',
  standalone: true,
  imports: [CommonModule, ApiTableComponent, CodeBlockComponent],
  templateUrl: './resource-model.html'
})
export class ResourceModelDocComponent {
  properties: ApiProperty[] = [
    { name: 'id', type: 'string', description: 'Unique identifier for the resource.' },
    { name: 'name', type: 'string', description: 'Display name of the resource.' },
    { name: 'color', type: 'string', description: 'Base color for the resource (border/background).' },
    { name: 'avatar', type: 'string', description: 'URL of image or initials for display.' },
    { name: 'description', type: 'string', description: 'Additional description of the resource.' },
    { name: 'tags', type: 'string[]', description: 'Tags for filtering.' },
    { name: 'isReadOnly', type: 'boolean', description: 'If true, events for this resource cannot be edited.' },
    { name: 'isBlocked', type: 'boolean', description: 'If true, this resource does not accept new events.' },
    { name: 'metadata', type: 'any', description: 'Flexible user-defined data.' },
  ];

  usageExample = `
const resource: ResourceModel = {
  id: 'room-a',
  name: 'Conference Room A',
  color: '#1a73e8',
  description: 'Main conference room with projector',
  tags: ['meeting-room', 'av-equipment'],
  isReadOnly: false,
  isBlocked: false
};
  `.trim();
}
