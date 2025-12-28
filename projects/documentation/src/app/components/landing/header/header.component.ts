import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="container mx-auto px-6 xl:px-24 py-6 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="text-2xl font-bold text-slate-800">
          mglon-schedule
        </span>
      </div>
      <div class="flex gap-4">
        <a routerLink="/docs" 
           class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Documentation
        </a>
        <a href="https://github.com/Ingeodev/ng-scheduler-workspace" target="_blank" 
           class="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
          GitHub
        </a>
      </div>
    </nav>
  `
})
export class LandingHeaderComponent { }
