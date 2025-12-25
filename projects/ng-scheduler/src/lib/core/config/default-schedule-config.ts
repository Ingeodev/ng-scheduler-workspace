import { SchedulerConfig } from '../models/config-schedule'

export const CELL_HEADER_HEIGHT = 24

/** Height of each event slot row in pixels */
export const SLOT_HEIGHT = 20

/** Vertical gap between event slots in pixels */
export const SLOT_GAP = 2

/** Default number of visible event rows in month view */
export const DEFAULT_VISIBLE_EVENT_ROWS = 3

export const DEFAULT_CONFIG: SchedulerConfig = {
  initialDate: new Date(),
  initialView: 'month',
  views: ['month', 'week', 'day', 'resource'],
  slotDuration: 30,
  dayStartHour: 0,
  dayEndHour: 23,
  resourceSidebarWidth: 200,
  allowOverlaps: true,
  locale: 'en',
  weekStartsOn: 0,
  theme: 'theme-light', // Asumimos un tema claro por defecto
  height: '100%',
  visibleEventRows: DEFAULT_VISIBLE_EVENT_ROWS,
  backgroundSelection: true,
  showNowIndicator: true,
  editable: true,
  showSidebar: true
}

export const DEFAULT_RESOURCE_INPUTS = {
  tags: [] as string[],
  isReadOnly: false,
  isBlocked: false,
  isActive: true,
};

export const DEFAULT_EVENT_INPUTS = {
  color: '#3788d8',
  allDay: false,
  description: '',
  data: null as any,
};
