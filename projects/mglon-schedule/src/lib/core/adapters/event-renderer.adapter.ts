import { DateRange } from "../models/date-range.model";
import { AnyEvent } from "../models/event.model";
import { SlotModel } from "../models/slot.model";

export abstract class EventRendererAdapter {
  abstract createSlots(events: AnyEvent[]): SlotModel[];
  abstract filterEvents(events: AnyEvent[], dateRange: DateRange): AnyEvent[];
}