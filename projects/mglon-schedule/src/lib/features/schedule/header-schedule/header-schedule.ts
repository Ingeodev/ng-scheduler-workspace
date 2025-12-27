import { Component, input, output, signal, inject, PLATFORM_ID, ElementRef, OnDestroy, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CalendarStore } from '../../../core/store/calendar.store';
import { IconComponent } from '../../../shared/components/icon/icon';
import { IconName } from '../../../shared/components/icon/icon-set';
import { ButtonGroupComponent } from '../../../shared/components/buttons/button-group/button-group';
import { ButtonComponent } from '../../../shared/components/buttons/button/button';
import { IconButtonComponent } from '../../../shared/components/buttons/icon-button/icon-button';
import { ViewMode } from '../../../core/models/config-schedule';

@Component({
  selector: 'mglon-header-schedule',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonGroupComponent, ButtonComponent, IconButtonComponent],
  templateUrl: './header-schedule.html',
  styleUrl: './header-schedule.scss',
})
export class HeaderSchedule implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private elementRef = inject(ElementRef);
  private resizeObserver?: ResizeObserver;
  private calendarStore = inject(CalendarStore);

  // Header UI Configuration from Store
  readonly buttonGroupAppearance = computed(() => this.calendarStore.uiConfig().header.buttonGroup.appearance);
  readonly buttonGroupRounded = computed(() => this.calendarStore.uiConfig().header.buttonGroup.rounded);
  readonly buttonGroupDensity = computed(() => this.calendarStore.uiConfig().header.buttonGroup.density);
  readonly iconButtonRounded = computed(() => this.calendarStore.uiConfig().header.iconButtons.rounded);
  readonly todayButtonRounded = computed(() => this.calendarStore.uiConfig().header.todayButton.rounded);
  readonly todayButtonAppearance = computed(() => this.calendarStore.uiConfig().header.todayButton.appearance);

  // Inputs
  readonly title = input.required<string>();
  readonly activeView = input.required<ViewMode>();
  readonly views = input<ViewMode[]>(['month', 'week', 'day', 'resource']);
  readonly editable = input<boolean>(true);

  // Outputs
  readonly next = output<void>();
  readonly prev = output<void>();
  readonly today = output<void>();
  readonly viewChange = output<ViewMode>();
  readonly add = output<void>();

  readonly viewIcons: Record<ViewMode, IconName> = {
    'month': 'calendar-month',
    'week': 'calendar-week',
    'day': 'calendar-day',
    'resource': 'calendar-week', // Fallback
    'list': 'calendar-month' // Fallback
  };

  // Responsive signal to track container size
  readonly isSmallScreen = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Use ResizeObserver to watch the component's own width
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          // Match the 'sm' breakpoint (767.98px)
          this.isSmallScreen.set(width <= 767.98);
        }
      });

      // Start observing the host element
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Clean up the observer
    this.resizeObserver?.disconnect();
  }
}
