import { ResourceModel } from './resource';

export type ViewMode = 'day' | 'week' | 'month' | 'resource' | 'list';

export interface SchedulerConfig {
  // --- 1. Estado Inicial ---
  /** Fecha inicial. Acepta Date object o string ISO. Defecto: new Date() */
  initialDate?: Date | string;

  /** Vista inicial al cargar. Defecto: 'month' */
  initialView?: ViewMode;

  // --- 2. Grid de Tiempo (Crucial para Resource/Week View) ---
  /** Duración de cada slot en minutos (15, 30, 60). Defecto: 30 */
  slotDuration?: number;

  /** Hora de inicio del día (0-23). Útil para ocultar la madrugada. Defecto: 0 */
  dayStartHour?: number;

  /** Hora de fin del día (0-23). Defecto: 23 */
  dayEndHour?: number;

  // --- 3. Resource View (Tu Feature Estrella) ---
  /** Ancho de la columna lateral de recursos en px. Defecto: 200 */
  resourceSidebarWidth?: number;

  /** Si es true, agrupa eventos superpuestos visualmente. Defecto: true */
  allowOverlaps?: boolean;

  // --- 4. Internacionalización (i18n) ---
  /** Código de idioma (ej: 'es', 'en-US'). Defecto: 'en' */
  locale?: string;

  /** Día de inicio de semana (0=Domingo, 1=Lunes). Defecto: 0 */
  weekStartsOn?: 0 | 1;

  // --- 5. Apariencia y Tema ---
  /** * Clase CSS base para aplicar temas predefinidos.
   * Ej: 'theme-google' o 'theme-dark'.
   * Esto activará las variables CSS correspondientes.
   */
  theme?: string;

  /** Altura del calendario (ej: 'auto', '100%', '600px'). Defecto: '100%' */
  height?: string;

  // --- 6. Interaccion y Visualizacion ---
  /** Array con los tipos de visualizacion que desea usar.
   * Defecto: ['month', 'week', 'day', 'resource'] */
  views?: ViewMode[];

  /** Activar o desactivar la opcion de seleccion.
   * Defecto: true */
  backgroundSelection?: boolean;

  /** Decidir si quiere ver la indicacion del dia actual.
   * Defecto: true */
  showNowIndicator?: boolean;

  /** Propiedad para activar o desactivar las opciones de edicion (como el boton add del header).
   * Defecto: true */
  editable?: boolean;

  /** Mostrar u ocultar el sidebar lateral.
   * Defecto: true */
  showSidebar?: boolean;

  /** Array de recursos a mostrar en el sidebar.
   * Defecto: [] */
  resources?: ResourceModel[];
}