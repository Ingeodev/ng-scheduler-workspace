import { Component, computed, inject, input } from '@angular/core'
import { CalendarStore } from '../../../core/store/calendar.store'
import { IconButtonComponent } from '../../../shared/components/buttons/icon-button/icon-button'
import { IconComponent } from '../../../shared/components/icon/icon'

/**
 * Toggle column component for expanding/collapsing weeks in the month view.
 * Shows a column of chevron icons that users can click to expand individual weeks.
 */
@Component({
  selector: 'mglon-month-toggle-column',
  imports: [IconButtonComponent, IconComponent],
  templateUrl: './month-toggle-column.html',
  styleUrl: './month-toggle-column.scss',
  host: {
    '[style.grid-template-rows]': 'gridTemplateRows()'
  }
})
export class MonthToggleColumn {
  private readonly store = inject(CalendarStore)

  /** Number of weeks to display toggles for */
  readonly weekCount = input.required<number>()

  /** Grid template rows to sync height with weeks */
  readonly gridTemplateRows = input.required<string>()

  /**
   * Array of week indices for iteration in template.
   */
  readonly weekIndices = computed(() => {
    return Array.from({ length: this.weekCount() }, (_, i) => i)
  })

  /**
   * Toggles the expansion state of a week.
   * @param weekIndex - Index of the week to toggle (0-based)
   */
  onToggle(weekIndex: number): void {
    this.store.toggleWeekExpansion(weekIndex)
  }

  /**
   * Checks if a week is currently expanded.
   * @param weekIndex - Index of the week to check
   * @returns true if the week is expanded
   */
  isExpanded(weekIndex: number): boolean {
    return this.store.expandedWeekIndex() === weekIndex
  }
}
