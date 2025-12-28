import { Component } from '@angular/core';
import { LandingHeaderComponent } from '../../components/landing/header/header.component';
import { HeroSectionComponent } from '../../components/landing/hero-section/hero-section.component';
import { SolutionsSectionComponent } from '../../components/landing/solutions-section/solutions-section.component';
import { LandingFooterComponent } from '../../components/landing/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    HeroSectionComponent,
    SolutionsSectionComponent,
    LandingFooterComponent
  ],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  solutions = [
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
