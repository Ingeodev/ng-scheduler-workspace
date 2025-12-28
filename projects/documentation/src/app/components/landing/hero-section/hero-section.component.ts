import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pb-8">
      <div class="container mx-auto px-4 lg:px-8 pt-8 pb-8">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Icon/Logo -->
          <div class="mb-6 flex justify-center">
            <img src="images/logo.svg" alt="mglon-schedule logo" class="w-20 h-20" />
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4 text-slate-800">
            A Powerful
            <span class="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Scheduler
            </span>
            for Angular
          </h1>

          <!-- Subtitle -->
          <p class="text-base md:text-lg text-slate-500 max-w-xl mx-auto mb-6">
            Build beautiful, interactive calendars and scheduling interfaces with ease. 
            Powered by Angular Signals for maximum performance.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a routerLink="/docs/getting-started/schedule" 
               class="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
              Get Started
            </a>
            <button 
               class="px-8 py-4 bg-white/80 backdrop-blur border border-slate-200 rounded-xl font-semibold text-lg text-slate-700 hover:bg-white transition-colors flex items-center justify-center gap-2 group"
               (click)="copyInstallCommand()">
              <code class="text-blue-600">npm install mglon-schedule</code>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Hero Image - Full Width with minimal margins -->
      <div class="px-4 lg:px-8">
        <img 
          src="images/hero-image.png" 
          alt="mglon-schedule preview" 
          class="w-full rounded-3xl shadow-xl"
        />
      </div>
    </section>
  `
})
export class HeroSectionComponent {
  copyInstallCommand() {
    navigator.clipboard.writeText('npm install mglon-schedule');
  }
}
