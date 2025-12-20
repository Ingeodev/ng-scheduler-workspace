import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';

import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './docs-layout.html'
})
export class DocsLayoutComponent { }
