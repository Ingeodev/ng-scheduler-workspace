import { Component, input, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../core/models/resource';
import { EventStore } from '../../../core/store/event.store';
import { InjectionToken } from '@angular/core';

/**
 * Injection token for providing resource ID to child components
 */
export const RESOURCE_ID_TOKEN = new InjectionToken<string>('RESOURCE_ID');

/**
 * ResourceComponent - Declarative component representing a calendar resource
 * 
 * Usage:
 * <mglon-resource 
 *   id="room-1" 
 *   name="Conference Room A"
 *   [color]="'#0860c4'">
 *   <mglon-event>...</mglon-event>
 * </mglon-resource>
 */
@Component({
  selector: 'mglon-resource',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: [`:host { display: contents; }`],
  providers: [
    {
      provide: RESOURCE_ID_TOKEN,
      useFactory: (component: ResourceComponent) => component.id(),
      deps: [ResourceComponent]
    }
  ]
})
export class ResourceComponent implements OnInit, OnDestroy {
  private readonly store = inject(EventStore);

  /** Unique identifier for the resource */
  readonly id = input.required<string>();

  /** Display name of the resource */
  readonly name = input.required<string>();

  /** Color for the resource (border/background) */
  readonly color = input<string>();

  /** URL of image or initials for display */
  readonly avatar = input<string>();

  /** Additional description of the resource */
  readonly description = input<string>();

  /** Tags for filtering */
  readonly tags = input<string[]>([]);

  /** If true, events for this resource cannot be edited */
  readonly isReadOnly = input<boolean>(false);

  /** If true, this resource does not accept new events */
  readonly isBlocked = input<boolean>(false);

  /** If true, resource is active and visible. Default: true */
  readonly isActive = input<boolean>(true);

  /** Flexible user-defined data */
  readonly metadata = input<any>();

  constructor() {
    // Sync isActive input changes to EventStore
    effect(() => {
      const shouldBeActive = this.isActive();
      const resourceId = this.id();

      if (resourceId) {
        if (shouldBeActive) {
          this.store.showResource(resourceId);
        } else {
          this.store.hideResource(resourceId);
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.registerResource();
  }

  /**
   * Lifecycle: Unregister resource on destroy
   */
  ngOnDestroy(): void {
    // Only unregister if the component was fully initialized
    try {
      const resourceId = this.id();
      if (resourceId) {
        this.store.unregisterResource(resourceId);
      }
    } catch (e) {
      // Ignore errors during cleanup (e.g., inputs not yet initialized in tests)
    }
  }

  private registerResource(): void {
    const resource: Resource = {
      id: this.id(),
      name: this.name(),
      color: this.color(),
      avatar: this.avatar(),
      description: this.description(),
      tags: this.tags(),
      isReadOnly: this.isReadOnly(),
      isBlocked: this.isBlocked(),
      isActive: this.isActive(),
      metadata: this.metadata()
    };

    this.store.registerResource(resource);
  }
}
