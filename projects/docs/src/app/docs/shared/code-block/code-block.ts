import { Component, input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-block.html'
})
export class CodeBlockComponent implements AfterViewInit, OnChanges {
  readonly code = input.required<string>();
  readonly language = input<string>('typescript');

  @ViewChild('codeElement') codeElement!: ElementRef;

  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    this.highlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] && !changes['code'].isFirstChange()) {
      this.highlight();
    }
  }

  private highlight() {
    if (isPlatformBrowser(this.platformId) && this.codeElement) {
      Prism.highlightElement(this.codeElement.nativeElement);
    }
  }

  copyCode() {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(this.code());
      // Could add a toast notification here
    }
  }
}
