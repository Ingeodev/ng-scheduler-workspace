import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../shared/code-block/code-block';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterLink, CodeBlockComponent],
  templateUrl: './intro.html'
})
export class IntroComponent { }
