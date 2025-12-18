import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS, IconName } from './icon-set';

@Component({
  selector: 'mglon-icon',
  standalone: true,
  template: `<div class="mglon-icon" [innerHTML]="svgContent()"></div>`,
  styles: [`
    :host { 
      display: inline-flex; 
      align-items: center; 
      justify-content: center;
      line-height: 1;
    }
    .mglon-icon {
      display: flex;
      align-items: center;  /* Centra verticalmente si el SVG es más pequeño */
      justify-content: center; /* Centra horizontalmente */
      width: 1em;   
      height: 1em;
      min-width: 1em; /* Asegura que no se aplaste en flexbox */
      min-height: 1em;
    }
    ::ng-deep svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      /* preserveAspectRatio="xMidYMid meet" es el default de SVG, 
         esto asegura que se escale ajustándose al contenedor sin deformarse */
    }
  `]
})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);

  // Input requerido tipo Signal
  name = input.required<IconName>();

  // Computada: Busca el string y lo sanitiza para evitar ataques XSS
  svgContent = computed<SafeHtml>(() => {
    const svgString = ICONS[this.name()] || '';
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  });
}