import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface ApiProperty {
  name: string;
  description: string;
  type?: string;
  typeLink?: string; // Optional link to API documentation
  defaultValue?: string;
}

@Component({
  selector: 'app-api-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './api-table.html'
})
export class ApiTableComponent {
  readonly properties = input.required<ApiProperty[]>();
}
