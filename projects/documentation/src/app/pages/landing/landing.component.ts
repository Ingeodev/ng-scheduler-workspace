import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Schedule } from 'mglon-schedule';

interface PreviewEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, Schedule],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  // Sample events for preview
  events: PreviewEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      start: this.getDateOffset(0, 9),
      end: this.getDateOffset(0, 10),
      color: '#3b82f6'
    },
    {
      id: '2',
      title: 'Project Review',
      start: this.getDateOffset(1, 14),
      end: this.getDateOffset(1, 16),
      color: '#10b981'
    },
    {
      id: '3',
      title: 'Sprint Planning',
      start: this.getDateOffset(2, 10),
      end: this.getDateOffset(2, 12),
      color: '#f59e0b'
    },
    {
      id: '4',
      title: 'Client Call',
      start: this.getDateOffset(3, 15),
      end: this.getDateOffset(3, 16),
      color: '#ef4444'
    },
    {
      id: '5',
      title: 'Workshop',
      start: this.getDateOffset(4, 9),
      end: this.getDateOffset(4, 17),
      allDay: true,
      color: '#8b5cf6'
    }
  ];

  features = [
    {
      icon: '📅',
      title: 'Multiple Views',
      description: 'Month, Week, Day, and Resource views out of the box'
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Built with Angular Signals for reactive, efficient updates'
    },
    {
      icon: '🎨',
      title: 'Fully Customizable',
      description: 'CSS variables and theming support for complete control'
    },
    {
      icon: '🔄',
      title: 'Recurrent Events',
      description: 'Native support for recurring events with RRule'
    },
    {
      icon: '🖱️',
      title: 'Drag & Drop',
      description: 'Intuitive drag and resize interactions'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Works beautifully on any screen size'
    }
  ];

  private getDateOffset(daysOffset: number, hour: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour, 0, 0, 0);
    return date;
  }
}
