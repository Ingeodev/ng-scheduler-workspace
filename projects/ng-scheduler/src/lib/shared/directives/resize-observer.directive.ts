import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

export interface ResizeEvent {
  width: number;
  height: number;
  entry: ResizeObserverEntry;
}

@Directive({
  selector: '[mglonResizeObserver]',
  standalone: true
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
  @Output() mglonResizeObserver = new EventEmitter<ResizeEvent>();

  private observer: ResizeObserver | null = null;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        this.mglonResizeObserver.emit({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          entry
        });
      }
    });

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
