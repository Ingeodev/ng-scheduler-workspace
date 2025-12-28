import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NgDocRootComponent,
  NgDocNavbarComponent,
  NgDocSidebarComponent
} from '@ng-doc/app';

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent
  ],
  template: `
    <ng-doc-root>
      <ng-doc-navbar>
        <a routerLink="/" class="brand" style="margin: 0; text-decoration: none; color: inherit;" ngDocNavbarLeft>
          mglon-schedule
        </a>
      </ng-doc-navbar>
      <ng-doc-sidebar></ng-doc-sidebar>
      <router-outlet></router-outlet>
    </ng-doc-root>
  `
})
export class DocsLayoutComponent { }
