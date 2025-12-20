import { SchedulerConfig } from '../models/config-schedule';

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
  backgroundSelection: true,
  showNowIndicator: true,
  editable: true
};