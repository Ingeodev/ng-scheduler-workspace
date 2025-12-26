import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getTextColor } from '../../helpers/color.helpers';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'mglon-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-inactive]': 'inactive()',
    '[style]': 'hostStyle()'
  }
})
export class Avatar {
  /** Image source URL (optional) */
  readonly src = input<string>('');

  /** Display name to derive initials from (optional) */
  readonly name = input<string>('');

  /** Background color for initials placeholder (optional) */
  readonly color = input<string>('');

  /** Alt text for accessibility */
  readonly alt = input<string>('Avatar');

  /** Size variant: xs (24px), sm (32px), md (40px), lg (48px), xl (64px) */
  readonly size = input<AvatarSize>('md');

  /** Show border around avatar */
  readonly showBorder = input<boolean>(false);

  /** Border color (CSS color value) */
  readonly borderColor = input<string>('var(--ngx-cal-primary)');

  /** Inactive state - applies grayscale and hides border */
  readonly inactive = input<boolean>(false);

  /** Track if image failed to load */
  imageError = false;

  /** Computed initials from the name */
  readonly initials = computed(() => {
    const nameStr = this.name();
    if (!nameStr) return '';

    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 0) return '';

    if (parts.length === 1) {
      const p = parts[0]
      return p.length > 1 ? p.substring(0, 2).toUpperCase() : p.toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  /** Computed style for host (border and gap) */
  readonly hostStyle = computed(() => {
    const styles: any = {};
    if (!this.inactive() && this.showBorder()) {
      styles.border = `2px solid ${this.borderColor()}`;
      styles.padding = '2px'; // Gap between border and circle
      styles.borderRadius = '50%'; // Ensure border is circular
    }
    return styles;
  });

  /** Computed style for inner element (background and text color) */
  readonly innerStyle = computed(() => {
    const styles: any = {};

    // Background color logic
    const bgColor = this.color();
    if (bgColor) {
      styles.backgroundColor = bgColor;
      styles.color = getTextColor(bgColor);
    }

    return styles;
  });

  onImageError() {
    this.imageError = true;
  }
}
