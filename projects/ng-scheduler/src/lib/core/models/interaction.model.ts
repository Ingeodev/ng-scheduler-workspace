import { AnyEvent } from './event.model';
import { ResizeSide } from '../../shared/directives/resizable.directive';

/**
 * Common structure for all event interactions.
 */
export interface EventInteraction<T = any> {
  /** The full event data */
  event: AnyEvent;
  /** The ID of the slot that triggered the event */
  slotId: string;
  /** Browser event that triggered the interaction (optional) */
  originalEvent?: MouseEvent | PointerEvent;
  /** Additional data specific to the interaction type */
  data?: T;
}

/**
 * Data specific to resize interactions.
 */
export interface ResizeInteractionData {
  /** Which side is being resized */
  side: ResizeSide;
  /** The date target where the resize handle is currently hovering */
  date: Date;
}

/**
 * Data specific to drag interactions.
 */
export interface DragInteractionData {
  /** The exact date where the event was grabbed */
  grabDate: Date;
  /** The date target where the event is currently hovering */
  hoverDate: Date | null;
}

/**
 * Types of interactions that can be dispatched.
 */
export type InteractionType =
  | 'click' | 'dblclick' | 'contextmenu'
  | 'mouseenter' | 'mouseleave'
  | 'resizeStart' | 'resize' | 'resizeEnd'
  | 'dragStart' | 'drag' | 'dragEnd';

/**
 * Wrapper for the interaction event dispatched through the store.
 */
export interface InteractionEvent {
  type: InteractionType;
  eventId: string;
  payload: EventInteraction;
}
