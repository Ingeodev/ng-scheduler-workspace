import { Component, input } from '@angular/core';
import { SolutionCardComponent } from '../solution-card/solution-card.component';

interface Solution {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-solutions-section',
  standalone: true,
  imports: [SolutionCardComponent],
  template: `
    <section class="py-24 bg-slate-50">
      <div class="container mx-auto px-6 xl:px-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Everything you need
          </h2>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto">
            A complete scheduling solution with all the features you'd expect and more.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (solution of solutions(); track solution.title) {
            <app-solution-card 
              [icon]="solution.icon"
              [title]="solution.title"
              [description]="solution.description" />
          }
        </div>
      </div>
    </section>
  `
})
export class SolutionsSectionComponent {
  solutions = input.required<Solution[]>();
}
