import { Component, computed, inject, input } from '@angular/core';
import { CalendarWeek, isEventInRange } from '../../../shared/helpers';
import { MonthCell } from '../month-cell/month-cell';
import { CELL_HEADER_HEIGHT } from '../../../core/config/default-schedule-config';
import { MonthWeekEventsContainer } from "../month-week-events-container/month-week-events-container";
import { CalendarStore } from '../../../core/store/calendar.store';
import { endOfDay, startOfDay } from 'date-fns';
import { AnyEvent } from '../../../core/models/event.model';
import { DateRange } from '../../../core/models/date-range.model';
import { EventRendererAdapter } from '../../../core/adapters/event-renderer.adapter';
import { SlotModel } from '../../../core/models/slot.model';
import { sliceEventsByWeek } from '../../../core/rendering/slicers/month-event-slicer';

@Component({
  selector: 'mglon-month-week',
  imports: [MonthCell, MonthWeekEventsContainer],
  templateUrl: './month-week.html',
  styleUrl: './month-week.scss',
})
export class MonthWeek extends EventRendererAdapter {

  private readonly store = inject(CalendarStore);

  readonly week = input.required<CalendarWeek>();

  readonly top = CELL_HEADER_HEIGHT;

  /**
   * Computes the week's date range from first to last day.
   */
  private readonly weekRange = computed<DateRange>(() => {
    const weekDays = this.week().days;
    if (weekDays.length === 0) {
      return { start: new Date(), end: new Date() };
    }
    return {
      start: startOfDay(weekDays[0].date),
      end: endOfDay(weekDays[weekDays.length - 1].date)
    };
  });

  /**
   * Available height for event slots (total row height minus cell header).
   */
  private readonly availableHeight = computed(() => {
    return Math.max(0, this.store.weekRowHeight() - CELL_HEADER_HEIGHT);
  });

  /**
   * Filters currentViewEvents to only include events
   * that intersect with this week's date range.
   */
  readonly events = computed(() => {
    const weekDays = this.week().days;
    if (weekDays.length === 0) return [];

    return this.filterEvents(this.store.currentViewEvents(), this.weekRange());
  });

  /**
   * Computed slots for this week's events.
   */
  readonly slots = computed(() => {
    return this.createSlots(this.events());
  });

  override filterEvents(events: AnyEvent[], dateRange: DateRange): AnyEvent[] {
    return events.filter(event =>
      isEventInRange(event, dateRange)
    );
  }

  override createSlots(events: AnyEvent[]): SlotModel[] {
    if (events.length === 0) return [];

    return sliceEventsByWeek(events, this.weekRange());
  }
}

/**
 * Analiza mi base de codigo actual. Es una libreria de calendario y pienso mostrar los eventos en distintos grids (day, month, week y resource). Ademas, tambien necesito añadir funcionalidad de drag and drop y resize. Necesito que estas funcionalidades sean independientes y condicionales a la configuracion del calendario (dragable, resizable properties). Para posicionar los eventos debo tener en cuenta el tipo (multidia, normal, todo el dia, repetible) y calcular dinamicamente unos slots que se posicionaran con una estrategia diferente por grilla.  Inicialmente estoy desarrollando la vista de mes pero debo de ser estrategico para que mis funcionalidades puedan en la medida de lo posible extenderse a las demas grids. El comportamiento esperado en la vista de mes es el siguiente:

1. Un evento de uno o varios dias en una semana mostraria un slot largo
2. Un evento de varios dias y varias semanas mostraria varios slots, uno por semana.
3. Un evento de varios dias y varios meses se muestra en el intervalo de fechas actual y se recalcula su posicion para coincidir en la otra vista del mes en los dias especificos.
4. Al hacer drag en un evento, este se cambia a pointer-events none  durante el mousemove para capturar el dia desde donde se arrastra y el dia actual donde esta el mouse para ir lanzando eventos de actualizacion del evento (es una idea que se  puede mejorar)
5. El funcionamiento del resize puede ser similar al de drag.
6. El espacio de renderizado de los slots sera dentro de month-week en mglon-month-week__events y este debe ser un
 */
