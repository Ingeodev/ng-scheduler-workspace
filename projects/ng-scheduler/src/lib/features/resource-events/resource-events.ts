import { Component, AfterContentInit, inject, ElementRef, Input, input } from '@angular/core';
import { ResourceModel } from '../../core/models/resource.model';

@Component({
  selector: 'mglon-resource-events',
  imports: [],
  template: `<ng-content></ng-content>`,
})
export class ResourceEvents implements AfterContentInit {

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

  private elRef = inject(ElementRef);

  ngAfterContentInit() {
    this._removeInvalidNodes();
  }

  private _removeInvalidNodes() {
    const children = this.elRef.nativeElement.childNodes;
    children.forEach((node: ChildNode) => {
      if (node.nodeType === 1 && (node as HTMLElement).tagName !== 'MGLON-EVENT') {
        console.warn(
          `[ResourceEvents] The element <${(node as HTMLElement).tagName.toLowerCase()}> is not allowed inside mglon-resource-events. Only mglon-event components are allowed. This node will be removed.`
        );
        node.remove();
      }
    });
  }
}
