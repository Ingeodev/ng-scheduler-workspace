export abstract class Selectable {
  /**
   * Traduce una coordenada visual (relativa al contenedor) a una fecha.
   */
  abstract getDateFromPoint(x: number, y: number): { date: Date, resourceId?: string } | null;
}