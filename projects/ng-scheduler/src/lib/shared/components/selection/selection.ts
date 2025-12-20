import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Represents the corners of a selection rectangle
 */
export interface SelectionCorner {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

@Component({
  selector: 'mglon-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.html',
  styleUrl: './selection.scss',
})
export class Selection {
  // Input for the selection corners (null means no selection)
  readonly selection = input<SelectionCorner | null>(null);

  // Input to control visibility (only show while actively selecting)
  readonly isSelecting = input<boolean>(false);

  // Computed style for the indicator based on selection corners
  readonly indicatorStyle = computed(() => {
    const sel = this.selection();
    const selecting = this.isSelecting();

    if (!sel || !selecting) {
      return { display: 'none' };
    }

    return {
      top: `${sel.top}px`,
      left: `${sel.left}px`,
      width: `${sel.right - sel.left}px`,
      height: `${sel.bottom - sel.top}px`,
      display: 'block'
    };
  });
}
