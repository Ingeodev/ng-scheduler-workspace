export type EventType = 'event' | 'spanned' | 'all-day' | 'recurrent';
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Regla de recurrencia compatible con RRule/iCalendar.
 * Define cómo y cuándo se repite un evento.
 */
export interface RecurrenceRule {
  id: string,
  type: RecurrenceType,

  /** Ej: 2 = "Cada 2 días/semanas...", 1 = "Todos los días/semanas..." */
  interval: number,

  /** Ej: 10 = "Se repite 10 veces y luego para" */
  count: number,

  /** Ej: 2024-12-31 = "Se repite hasta final de año" */
  until: Date,

  /** Ej: ['Mon', 'Wed', 'Fri'] = "Lunes, Miércoles y Viernes" (Solo si type='weekly') */
  byDay?: DayOfWeek[],

  /** Ej: [1, 6] = "En Enero y Junio" (Solo si type='yearly') */
  byMonth?: number[],

  /** Ej: [1, 15] = "El día 1 y el 15 del mes" (Solo si type='monthly') */
  byMonthDay?: number[],

  /** Ej: [-1] = "El último día del mes", [1] = "El primer día del mes" */
  bySetPos?: number[],
}

/**
 * Modelo de Recurso (Ej: Sala, Persona, Maquinaria).
 * Entidad que "posee" eventos.
 */
export interface ResourceModel {
  id: string,
  name: string,

  // -- Visual & UI --
  color?: string,       // Color base para el recurso (borde/fondo)
  avatar?: string,      // URL de imagen o iniciales
  description?: string,
  tags?: string[],      // Etiquetas para filtrado

  // -- Control & Lógica --
  isReadOnly?: boolean, // Si true, no se pueden editar sus eventos
  isBlocked?: boolean,  // Si true, no acepta nuevos eventos
  metadata?: any,       // Datos flexibles del usuario
}

/**
 * Modelo de Evento Base.
 * Representa una unidad de tiempo ocupada en el calendario.
 */
export interface EventModel {
  id: string

  // -- Relaciones --
  resourceId?: string,  // FK: ID del recurso al que pertenece (si aplica)

  // -- Contenido --
  title: string
  description?: string,
  tags?: string[],      // Etiquetas para filtrado/estilos

  // -- Temporalidad --
  start: Date,
  end: Date,
  isAllDay?: boolean,
  type: EventType,      // Tipo visual/lógico del evento

  // -- Recurrencia --
  recurrenceRule?: RecurrenceRule,
  recurrenceException?: Date[],

  // -- Control --
  isReadOnly?: boolean,
  isBlocked?: boolean,  // Visualmente bloqueado (ej: mantenimiento)
  metadata?: any,       // Datos flexibles del usuario
}