import { Directive, ElementRef, inject, PLATFORM_ID, output, signal, HostListener, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Selectable } from './selectable.abstract';
import { SelectionCorner } from '../../components/selection/selection';

/**
 * Result of a selection operation containing start and end dates/resources
 */
export interface SelectionResult {
  start: { date: Date; resourceId?: string } | null;
  end: { date: Date; resourceId?: string } | null;
}

/**
 * Coordinates relative to a container element
 */
interface RelativeCoordinates {
  x: number;
  y: number;
}

/**
 * Directive that enables mouse-based selection on calendar views.
 * 
 * Works with components that implement the Selectable interface to translate
 * visual coordinates into dates/resources. Handles all mouse interaction logic
 * and emits selection events.
 * 
 * @example
 * ```html
 * <div [mglonSelectable]="this"
 *      (selectionStart)="onStart($event)"
 *      (selectionChange)="onChange($event)"
 *      (selectionEnd)="onEnd($event)">
 * </div>
 * ```
 */
@Directive({
  selector: '[mglonSelectable]',
  standalone: true
})
export class SelectableDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * The component that implements Selectable interface.
   * Provides the getDateFromPoint() method to translate coordinates to dates.
   */
  @Input('mglonSelectable') selectable!: Selectable;

  /**
   * Emitted when user starts a selection (mousedown)
   */
  readonly selectionStart = output<SelectionResult>();

  /**
   * Emitted when selection changes (mousemove while selecting)
   */
  readonly selectionChange = output<SelectionResult>();

  /**
   * Emitted when selection ends (mouseup)
   */
  readonly selectionEnd = output<SelectionResult>();

  /**
   * Current selection rectangle coordinates (relative to container)
   */
  readonly selection = signal<SelectionCorner | null>(null);

  /**
   * Whether user is currently selecting (mouse button is down)
   */
  readonly isSelecting = signal<boolean>(false);

  /** Starting point of the selection */
  private startPoint: RelativeCoordinates | null = null;

  /** Date/resource data at the starting point */
  private startData: { date: Date; resourceId?: string } | null = null;

  /** Date/resource data at the current cursor position */
  private currentData: { date: Date; resourceId?: string } | null = null;

  /**
   * Handles mousedown event to initiate selection
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.canSelect()) return;

    const coords = this.getRelativeCoordinates(event);
    this.startSelection(coords, event.clientX, event.clientY);
  }

  /**
   * Handles mousemove event to update selection
   */
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isSelecting() || !this.startPoint || !this.canSelect()) return;

    const coords = this.getRelativeCoordinates(event);
    this.updateSelection(coords, event.clientX, event.clientY);
  }

  /**
   * Handles mouseup event to complete selection
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.isSelecting() || !this.canSelect()) return;

    this.endSelection();
  }

  /**
   * Checks if selection is possible (browser platform and selectable is set)
   */
  private canSelect(): boolean {
    return isPlatformBrowser(this.platformId) && !!this.selectable;
  }

  /**
   * Converts mouse event coordinates to coordinates relative to the container
   * 
   * @param event - Mouse event with clientX/clientY
   * @returns Coordinates relative to the container's top-left corner
   */
  private getRelativeCoordinates(event: MouseEvent): RelativeCoordinates {
    const containerElement = this.elementRef.nativeElement as HTMLElement;
    const rect = containerElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  /**
   * Initiates a new selection
   * 
   * @param coords - Relative coordinates where selection started
   * @param absoluteX - Absolute X coordinate (for element detection)
   * @param absoluteY - Absolute Y coordinate (for element detection)
   */
  private startSelection(coords: RelativeCoordinates, absoluteX: number, absoluteY: number): void {
    this.isSelecting.set(true);
    this.startPoint = coords;

    // Get the date/resource from the starting point
    this.startData = this.selectable.getDateFromPoint(coords.x, coords.y);
    this.currentData = this.startData;

    // Initialize selection rectangle at a single point
    this.selection.set({
      top: coords.y,
      left: coords.x,
      bottom: coords.y,
      right: coords.x
    });

    // Emit selection start event
    this.selectionStart.emit({
      start: this.startData,
      end: this.currentData
    });
  }

  /**
   * Updates an ongoing selection
   * 
   * @param coords - Current relative coordinates
   * @param absoluteX - Absolute X coordinate (for element detection)
   * @param absoluteY - Absolute Y coordinate (for element detection)
   */
  private updateSelection(coords: RelativeCoordinates, absoluteX: number, absoluteY: number): void {
    if (!this.startPoint) return;

    // Calculate selection rectangle (supports dragging in any direction)
    const rect = this.calculateSelectionRectangle(this.startPoint, coords);
    this.selection.set(rect);

    // Get the date/resource from the current point
    this.currentData = this.selectable.getDateFromPoint(coords.x, coords.y);

    // Emit selection change event
    this.selectionChange.emit({
      start: this.startData,
      end: this.currentData
    });
  }

  /**
   * Completes the current selection
   */
  private endSelection(): void {
    this.isSelecting.set(false);

    // Emit final selection event
    this.selectionEnd.emit({
      start: this.startData,
      end: this.currentData
    });

    // Clear selection state
    this.clearSelection();
  }

  /**
   * Calculates the selection rectangle from start and end points.
   * Handles dragging in any direction by using min/max.
   * 
   * @param start - Starting point coordinates
   * @param end - Ending point coordinates
   * @returns Selection rectangle with top, left, bottom, right
   */
  private calculateSelectionRectangle(
    start: RelativeCoordinates,
    end: RelativeCoordinates
  ): SelectionCorner {
    return {
      top: Math.min(start.y, end.y),
      left: Math.min(start.x, end.x),
      bottom: Math.max(start.y, end.y),
      right: Math.max(start.x, end.x)
    };
  }

  /**
   * Clears all selection state
   */
  private clearSelection(): void {
    this.selection.set(null);
    this.startPoint = null;
    this.startData = null;
    this.currentData = null;
  }
}
