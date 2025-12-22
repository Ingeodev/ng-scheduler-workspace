/**
 * Resource interface for scheduler
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: string;

  /** Display name of the resource */
  name: string;

  /** Color for the resource (border/background) */
  color?: string;

  /** URL of image or initials for display */
  avatar?: string;

  /** Additional description of the resource */
  description?: string;

  /** Tags for filtering */
  tags?: string[];

  // -- Control & Logic --
  isActive?: boolean;   // If true, resource is active and visible. Default: true

  /** If true, events for this resource cannot be edited */
  isReadOnly?: boolean;

  /** If true, this resource does not accept new events */
  isBlocked?: boolean;

  /** Flexible user-defined data */
  metadata?: any;
}
