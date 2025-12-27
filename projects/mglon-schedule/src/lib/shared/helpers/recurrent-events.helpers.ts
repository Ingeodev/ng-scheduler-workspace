import { RRule, Frequency } from 'rrule';
import { RecurrentEventModel, Event, DayOfWeek } from '../../core/models/event.model';
import { DateRange } from '../../core/models/date-range.model';
import { differenceInMilliseconds, addMilliseconds } from 'date-fns';

const DAY_MAP: Record<DayOfWeek, any> = {
  'Sun': RRule.SU,
  'Mon': RRule.MO,
  'Tue': RRule.TU,
  'Wed': RRule.WE,
  'Thu': RRule.TH,
  'Fri': RRule.FR,
  'Sat': RRule.SA
};

/**
 * Expands a recurrent event into a list of individual event instances for a given date range.
 * Each instance has a composite ID: {parentID}_{timestamp}
 * 
 * @param recurrentEvent The recurrence definition
 * @param range The search range (DateRange)
 * @returns Array of Event instances
 */
export function expandRecurrentEvent(
  recurrentEvent: RecurrentEventModel,
  range: DateRange
): Event[] {
  const { start: rangeStart, end: rangeEnd } = range;
  const rule = recurrentEvent.recurrenceRule;

  // Mapping frequency
  const freqMap: Record<string, Frequency> = {
    'daily': RRule.DAILY,
    'weekly': RRule.WEEKLY,
    'monthly': RRule.MONTHLY,
    'yearly': RRule.YEARLY
  };

  // Duration of the original event
  const duration = differenceInMilliseconds(recurrentEvent.end, recurrentEvent.start);

  // Configure options for RRule
  const options: any = {
    freq: freqMap[rule.type],
    dtstart: recurrentEvent.start,
    interval: rule.interval || 1,
  };

  if (rule.until) options.until = rule.until;
  if (rule.count) options.count = rule.count;
  if (rule.byDay) options.byweekday = rule.byDay.map(day => DAY_MAP[day]);
  if (rule.byMonth) options.bymonth = rule.byMonth;
  if (rule.byMonthDay) options.bymonthday = rule.byMonthDay;
  if (rule.bySetPos) options.bysetpos = rule.bySetPos;
  if (rule.weekStart) options.wkst = DAY_MAP[rule.weekStart];

  const rrule = new RRule(options);

  // Get occurrences within the requested range
  const occurrences = rrule.between(rangeStart, rangeEnd, true);

  // Filter out exceptions if they exist (comparing timestamps for precision)
  const exceptions = recurrentEvent.recurrenceExceptions?.map(d => d.getTime()) || [];

  return occurrences
    .filter(date => !exceptions.includes(date.getTime()))
    .map(date => {
      // Calculate individual instance end date based on original duration
      const instanceEnd = addMilliseconds(date, duration);

      // We extract everything from the recurrent model EXCEPT the recurrence-specific 
      // fields and the 'type' field, to strictly conform to the Event interface.
      const {
        recurrenceRule,
        recurrenceExceptions,
        type: _parentType, // ignore the 'recurrent' type
        ...baseProps
      } = recurrentEvent;

      return {
        ...baseProps,
        id: `${recurrentEvent.id}_${date.getTime()}`,
        start: date,
        end: instanceEnd,
        type: 'event', // Behave as a normal event for rendering
        isRecurrenceInstance: true,
        parentRecurrenceId: recurrentEvent.id,
        recurrenceDate: date
      } as Event;
    });
}
