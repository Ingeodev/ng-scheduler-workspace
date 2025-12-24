import { Component, input, output, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyEvent } from '../../../core/models/event';
import { EventRendererFactory } from '../../../core/rendering/event-renderer.factory';
import { GroupSlotComponent } from '../group-slot/group-slot';
import { GroupSlot } from '../slot/slot';
import { generateEventColorScheme, getEventColor } from '../../helpers/color.helpers';
import { EventStore } from '../../../core/store/event.store';
import { MONTH_VIEW_LAYOUT } from '../../../core/config/month-view.config';

/**
 * Raw layout data passed from the View (e.g. MonthView)
 */
export interface LayoutSegment {
  slotIndex: number;
  viewBoundaries: { start: Date; end: Date };
  cellDimensions: { width: number; height: number };
  dateContext: Date; // The context date (e.g. week start or specific day)
}

/**
 * EventRenderComponent (Controller)
 * 
 * Acts as the brain for rendering a single event that may be split across 
 * multiple visual slots (e.g. multi-day event in Month View).
 * 
 * - Calculates geometry for all segments using the EventRenderer strategy.
 * - Manages shared state (hover, selection) for the entire group.
 * - Delegates visual rendering to <mglon-group-slot>.
 */
@Component({
  selector: 'mglon-event-render',
  standalone: true,
  imports: [CommonModule, GroupSlotComponent],
  template: `
    <mglon-group-slot
      [slots]="derivedSlots()"
      [event]="event()"
      [isHovered]="isHovered()"
      [isSelected]="isSelected()"
      [showTime]="showTime()"
      [rounded]="rounded()"
      (slotHover)="onSlotHover($event)"
      (slotClick)="onSlotClick()">
    </mglon-group-slot>
  `,
  styleUrl: './event-render.scss' // Keeping empty scss or removing if unused
})
export class EventRenderComponent {
  // Inputs
  event = input.required<AnyEvent>();

  // The raw segments from the view (e.g. "This event is in Week 1, Slot 2 and Week 2, Slot 0")
  layoutSegments = input.required<LayoutSegment[]>();

  showTime = input<boolean>(true);
  viewMode = input<'month' | 'week' | 'day'>('month');

  // UI configuration
  rounded = input<'none' | 'sm' | 'full'>('sm');

  // Optional override for color
  eventColor = input<string | undefined>(undefined);

  // Outputs
  eventClicked = output<AnyEvent>();
  eventHovered = output<AnyEvent>();

  // Injected services
  private eventStore = inject(EventStore);

  // Internal State
  private hoveredSignal = signal(false);
  private selectedSignal = signal(false);

  // Computed state
  isHovered = computed(() => this.hoveredSignal());
  isSelected = computed(() => this.selectedSignal());

  // Renderer Factory
  private renderer = computed(() => EventRendererFactory.getRenderer(this.viewMode()));

  /**
   * Computed: Generates the list of visual slots by running the renderer for each segment
   */
  derivedSlots = computed(() => {
    const event = this.event();
    const segments = this.layoutSegments();
    const renderer = this.renderer();
    const baseColor = this.getEffectiveColor();
    const colorScheme = generateEventColorScheme(baseColor);

    return segments.map(seg => {
      // Execute the strategy for this specific segment context
      const renderData = renderer.render(
        event,
        seg.dateContext,
        seg.cellDimensions,
        seg.slotIndex,
        seg.viewBoundaries
      );

      // Generate styles with color scheme
      const style = {
        '--event-x': this.formatValue(renderData.position.left),
        '--event-y': this.formatValue(renderData.position.top),
        '--event-width': this.formatValue(renderData.position.width),
        '--event-height': this.formatValue(renderData.position.height),
        '--event-z': renderData.zIndex,
        '--event-color': colorScheme.base,
        '--event-hover-color': colorScheme.hover,
        '--event-bg-color': colorScheme.background,
        '--event-text-color': colorScheme.text
      };

      return {
        renderData,
        style
      } as GroupSlot;
    });
  });

  // --- Interaction Handlers ---

  onSlotHover(isEntering: boolean) {
    this.hoveredSignal.set(isEntering);
    if (isEntering) {
      this.eventHovered.emit(this.event());
    }
  }

  onSlotClick() {
    this.eventClicked.emit(this.event());
  }

  // --- Public API ---

  select() {
    this.selectedSignal.set(true);
  }

  deselect() {
    this.selectedSignal.set(false);
  }

  // --- Helpers ---

  /**
   * Resolves the effective color for this event
   * Priority: explicit override > event.color > resource.color > default
   */
  private getEffectiveColor(): string {
    const override = this.eventColor();
    if (override) return override;

    return getEventColor(
      this.event(),
      (id) => this.eventStore.getResource(id),
      MONTH_VIEW_LAYOUT.DEFAULT_EVENT_COLOR
    );
  }

  private formatValue(value: number | string) {
    if (typeof value === 'string') return value;
    return `${value}px`;
  }
}
