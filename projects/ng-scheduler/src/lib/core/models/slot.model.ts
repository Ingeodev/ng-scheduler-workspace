
export interface SlotPosition {
  /** Vertical position in pixels (row-based) */
  top: number;
  /** Horizontal position as percentage (0-100) */
  left: number;
  /** Height in pixels */
  height: number;
  /** Width as percentage (0-100) */
  width: number;
}

export type slotType = 'full' | 'first' | 'last' | 'middle';

export interface SlotModel {
  id: string;
  idEvent: string;
  start: Date;
  end: Date;
  position: SlotPosition;
  zIndex: number;
  type: slotType;
}