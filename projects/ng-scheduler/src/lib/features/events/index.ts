/**
 * Events Module - Declarative event components
 * 
 * This module provides declarative components for defining calendar events
 * in a hierarchical, Angular-native way.
 * 
 * Usage Example:
 * <mglon-schedule [config]="config">
 *   <mglon-resource id="room-1" name="Conference Room A">
 *     <mglon-event id="evt-1" title="Meeting" [start]="..." [end]="..."></mglon-event>
 *     <mglon-all-day-event id="evt-2" title="Holiday" [date]="..."></mglon-all-day-event>
 *   </mglon-resource>
 *   
 *   <mglon-recurrent-event 
 *     id="evt-3" 
 *     title="Weekly Standup"
 *     recurrenceType="weekly"
 *     [start]="..." 
 *     [end]="...">
 *   </mglon-recurrent-event>
 * </mglon-schedule>
 */

export * from './resource/resource';
export * from './event/event';
export * from './recurrent-event/recurrent-event';
export * from './all-day-event/all-day-event';
