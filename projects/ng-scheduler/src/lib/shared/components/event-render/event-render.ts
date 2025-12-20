/**
 * @fileoverview Event Render Component - Visual representation of events
 * @module ng-scheduler/components
 */

import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyEvent } from '../../../core/models/event';
import { EventRenderData } from '../../../core/rendering/event-renderer';

/**
 * EventRenderComponent
 * 
 * Basic visual component for rendering events in the scheduler.
 * Handles positioning, styling, and basic state (hover, selection).
 * 
 * Future enhancements will add drag & drop interactions.
 */
@Component({
  selector: 'mglon-event-render',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="event-render"
      [class.is-dragging]="isDragging()"
      [class.is-resizing]="isResizing()"
      [class.is-hovered]="isHovered()"
      [class.is-selected]="isSelected()"
      [style]="eventStyles()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="onEventClick()">
      
      <!-- Event content -->
      <div class="event-render__content">
        <span class="event-render__title">{{ event().title }}</span>
        <span class="event-render__time" *ngIf="showTime()">
          {{ formatTime(event()) }}
        </span>
      </div>
      
      <!-- Continuation indicators for multi-day events -->
      <div class="event-render__continue-left" *ngIf="!isStart()"></div>
      <div class="event-render__continue-right" *ngIf="!isEnd()"></div>
    </div>
  `,
  styleUrl: './event-render.scss'
})
export class EventRenderComponent {
  // Inputs
  event = input.required<AnyEvent>();
  renderData = input.required<EventRenderData>();
  showTime = input<boolean>(true);
  eventColor = input<string>('#0860c4'); // Color with resource inheritance

  // Multi-day slice indicators
  isStart = input<boolean>(true);
  isEnd = input<boolean>(true);

  // Internal state
  private hoveredSignal = signal(false);
  private selectedSignal = signal(false);

  // Outputs
  eventClicked = output<AnyEvent>();
  eventHovered = output<AnyEvent>();

  // Computed states
  isDragging = computed(() => this.renderData().isDragging);
  isResizing = computed(() => this.renderData().isResizing);
  isHovered = computed(() => this.hoveredSignal());
  isSelected = computed(() => this.selectedSignal());

  /**
   * Computes dynamic styles for event positioning
   */
  eventStyles = computed(() => {
    const data = this.renderData();
    const color = this.eventColor();

    return {
      '--event-x': `${data.position.left}px`,
      '--event-y': `${data.position.top}px`,
      '--event-width': `${data.position.width}px`,
      '--event-height': `${data.position.height}px`,
      '--event-z': data.zIndex,
      'background-color': color,
      'border-left-color': color
    };
  });

  /**
   * Formats event time for display
   */
  formatTime(event: AnyEvent): string {
    if (event.type !== 'event') return '';

    const start = event.start;
    const end = event.end;

    const formatHour = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    return `${formatHour(start)} - ${formatHour(end)}`;
  }

  onMouseEnter() {
    this.hoveredSignal.set(true);
    this.eventHovered.emit(this.event());
  }

  onMouseLeave() {
    this.hoveredSignal.set(false);
  }

  onEventClick() {
    this.eventClicked.emit(this.event());
  }

  /**
   * Public API for external selection
   */
  select() {
    this.selectedSignal.set(true);
  }

  deselect() {
    this.selectedSignal.set(false);
  }
}
