import { Component } from '@angular/core';
import { Schedule, ResourceEvents, Event, RecurrentEvent } from 'mglon-schedule';

interface ResourceData {
  id: string;
  name: string;
  color: string;
}

interface EventData {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  allDay: boolean;
  resourceId: string;
}

interface RecurrentEventData {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  resourceId: string;
  recurrenceRule: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    count?: number;
  };
}

@Component({
  selector: 'app-calendar-preview',
  standalone: true,
  imports: [Schedule, ResourceEvents, Event, RecurrentEvent],
  templateUrl: 'calendar-preview.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class CalendarPreviewComponent {
  config = {
    initialView: 'month' as const,
    showSidebar: false,
    height: '100%'
  };

  // 4 Resources with distinct colors
  resources: ResourceData[] = [
    { id: 'dev', name: 'Development', color: '#3b82f6' },
    { id: 'design', name: 'Design', color: '#10b981' },
    { id: 'marketing', name: 'Marketing', color: '#f59e0b' },
    { id: 'hr', name: 'Human Resources', color: '#8b5cf6' }
  ];

  // 6 All-Day Events
  allDayEvents: EventData[] = [
    { id: 'allday-1', title: 'Tech Conference', startDate: this.createDate(5), endDate: this.createDate(5, 23, 59), resourceId: 'dev', color: '#3b82f6', allDay: true },
    { id: 'allday-2', title: 'Brand Review', startDate: this.createDate(7), endDate: this.createDate(7, 23, 59), resourceId: 'design', color: '#10b981', allDay: true },
    { id: 'allday-3', title: 'Product Launch', startDate: this.createDate(12), endDate: this.createDate(12, 23, 59), resourceId: 'marketing', color: '#f59e0b', allDay: true },
    { id: 'allday-4', title: 'Company Holiday', startDate: this.createDate(20), endDate: this.createDate(20, 23, 59), resourceId: 'hr', color: '#8b5cf6', allDay: true },
    { id: 'allday-5', title: 'Hackathon', startDate: this.createDate(25), endDate: this.createDate(25, 23, 59), resourceId: 'dev', color: '#3b82f6', allDay: true },
    { id: 'allday-6', title: 'Client Day', startDate: this.createDate(28), endDate: this.createDate(28, 23, 59), resourceId: 'marketing', color: '#f59e0b', allDay: true }
  ];

  // 4 Multi-Day Events
  multiDayEvents: EventData[] = [
    { id: 'multi-1', title: 'Sprint Planning', startDate: this.createDate(1, 9), endDate: this.createDate(3, 17), resourceId: 'dev', color: '#3b82f6', allDay: false },
    { id: 'multi-2', title: 'Design Workshop', startDate: this.createDate(8, 10), endDate: this.createDate(10, 16), resourceId: 'design', color: '#10b981', allDay: false },
    { id: 'multi-3', title: 'Marketing Campaign', startDate: this.createDate(15, 8), endDate: this.createDate(18, 18), resourceId: 'marketing', color: '#f59e0b', allDay: false },
    { id: 'multi-4', title: 'Team Retreat', startDate: this.createDate(22), endDate: this.createDate(24, 23, 59), resourceId: 'hr', color: '#8b5cf6', allDay: false }
  ];

  // 1 Recurrent Event
  recurrentEvents: RecurrentEventData[] = [
    {
      id: 'rec-1',
      title: 'Weekly Standup',
      startDate: this.createDate(2, 9),
      endDate: this.createDate(2, 9, 30),
      resourceId: 'dev',
      color: '#3b82f6',
      recurrenceRule: { type: 'weekly', interval: 1, count: 4 }
    }
  ];

  // Get events by resource
  getEventsForResource(resourceId: string): EventData[] {
    return [...this.allDayEvents, ...this.multiDayEvents].filter(e => e.resourceId === resourceId);
  }

  getRecurrentEventsForResource(resourceId: string): RecurrentEventData[] {
    return this.recurrentEvents.filter(e => e.resourceId === resourceId);
  }

  private createDate(day: number, hour = 0, minute = 0): Date {
    const date = new Date();
    date.setDate(day);
    date.setHours(hour, minute, 0, 0);
    return date;
  }
}
