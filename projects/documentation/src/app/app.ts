import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import {
  NgDocRootComponent,
  NgDocNavbarComponent,
  NgDocSidebarComponent
} from '@ng-doc/app'

@Component({
  selector: 'app-root',
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
        <h3 class="brand" style="margin: 0" ngDocNavbarLeft>MyDocs</h3>
      </ng-doc-navbar>
      <ng-doc-sidebar></ng-doc-sidebar>
      <router-outlet></router-outlet>
    </ng-doc-root>
  `,
  styles: []
})
export class App { }
