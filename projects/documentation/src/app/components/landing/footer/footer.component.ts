import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  template: `
    <footer class="py-12 bg-slate-100 border-t border-slate-200">
      <div class="container mx-auto px-6 xl:px-24 text-center">
        <p class="text-slate-500">
          MIT License © 2024
          <a href="https://migueloncoder.github.io/miguelon-portafolio/" target="_blank" 
             class="text-blue-600 hover:underline">
            miguelonCoder
          </a>
        </p>
      </div>
    </footer>
  `
})
export class LandingFooterComponent { }
