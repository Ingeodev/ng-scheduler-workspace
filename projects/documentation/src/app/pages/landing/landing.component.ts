import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CalendarPreviewComponent } from '../../components/calendar-preview/calendar-preview.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, CalendarPreviewComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
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
}

