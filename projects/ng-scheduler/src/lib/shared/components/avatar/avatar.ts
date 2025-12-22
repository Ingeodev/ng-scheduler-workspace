import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  }
})
export class Avatar {
  /** Image source URL */
  readonly src = input<string>('');

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

  /** Computed style for border */
  readonly borderStyle = computed(() => {
    // Hide border if inactive or showBorder is false
    if (this.inactive() || !this.showBorder()) return {};
    return {
      border: `2px solid ${this.borderColor()}`
    };
  });

  onImageError() {
    this.imageError = true;
  }
}
