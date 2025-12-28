import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from '../code-block/code-block';

@Component({
  selector: 'app-example-viewer',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent],
  templateUrl: './example-viewer.html',
  styles: [`
    .bg-dots {
      background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `]
})
export class ExampleViewerComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');
  readonly title = input<string>('Example');

  readonly activeTab = signal<'preview' | 'code'>('preview');
}
