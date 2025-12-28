import { Component, input } from '@angular/core';

@Component({
  selector: 'app-solution-card',
  standalone: true,
  template: `
    <div class="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
      <div class="text-4xl mb-4">{{ icon() }}</div>
      <h3 class="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
        {{ title() }}
      </h3>
      <p class="text-slate-500">{{ description() }}</p>
    </div>
  `
})
export class SolutionCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
