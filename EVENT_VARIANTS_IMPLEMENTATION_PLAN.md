# Multi-Type Event Support Implementation Plan

## Goal

Support three distinct event types (`Event`, `AllDayEvent`, `RecurrentEvent`) with dedicated components, proper rendering across all views, and intelligent recurrence expansion with caching.

---

## Core Strategy

1. **Separate Components**: Create `mglon-event`, `mglon-all-day-event`, `mglon-recurrent-event` with type-specific inputs/outputs
2. **Smart Expansion**: Expand recurrent events to visible date range with LRU cache (3 pages)
3. **View-Specific Rendering**:
   - **MonthView**: All types render in same grid, visual differentiation via styling
   - **Week/Resource Views**: Dedicated sticky all-day row for `AllDayEvent` and multi-day events
4. **Visual Differentiation**: Recurrent events show subtle indicator (icon/pattern) in MonthView

---

## Phase 1: Foundation - Recurrence Infrastructure

### 1.1 Install rrule.js
```bash
pnpm add rrule
pnpm add -D @types/rrule
```

### 1.2 Create Recurrence Service

#### [NEW] `core/services/recurrence.service.ts`

**Responsibilities:**
- Expand `RecurrentEvent` to array of `Event` instances using rrule.js
- Implement LRU cache (3 pages) with range-based keys
- Handle recurrence exceptions (`recurrenceExceptions`)
- Provide cache invalidation methods

**Key Methods:**
```typescript
class RecurrenceService {
  expandWithCache(event: RecurrentEvent, range: DateRange): Event[]
  invalidateRecurrence(recurrentEventId: string): void
  clearCache(): void
  private getRangeKey(range: DateRange): string
}
```

**Cache Strategy:**
- Cache key: `${eventId}_${rangeStart}_${rangeEnd}`
- Max 3 pages (LRU eviction)
- Each page limited to 1000 expanded events (warning if exceeded)

### 1.3 Update CalendarStore

#### [MODIFY] `core/store/calendar.store.ts`

Add `expandedEvents` computed:
```typescript
readonly expandedEvents = computed(() => {
  const rawEvents = Array.from(this.events().values());
  const range = this.viewRange();
  
  return rawEvents.flatMap(event => {
    if (event.type === 'recurrent') {
      return this.recurrenceService.expandWithCache(event, range);
    }
    return [event];
  });
});

// Update currentViewEvents to use expandedEvents
readonly currentViewEvents = computed(() => 
  filterEvents(this.expandedEvents(), this.viewRange())
);
```

Add invalidation on recurrent event mutations:
```typescript
updateEvent(id: string, updates: Partial<AnyEvent>): void {
  const event = this.events().get(id);
  if (event?.type === 'recurrent') {
    this.recurrenceService.invalidateRecurrence(id);
  }
  // ... existing logic
}
```

### 1.4 Extend Event Model

#### [MODIFY] `core/models/event.model.ts`

Add metadata for expanded instances:
```typescript
export interface Event extends EventBase {
  start: Date;
  end: Date;
  type: 'event';
  
  // New: tracking for recurrence instances
  isRecurrenceInstance?: boolean;
  parentRecurrenceId?: string;
  recurrenceDate?: Date; // Original occurrence date
}
```

---

## Phase 2: Component Architecture

### 2.1 Create Base Event Component

#### [NEW] `features/event/event-base/event-base.ts`

**Shared Logic:**
- Common inputs: `id`, `title`, `color`, `resourceId`, `isReadOnly`, `isBlocked`
- Interaction outputs: `click`, `dblclick`, `mouseenter`, `mouseleave`
- Drag/resize outputs: `dragStart`, `drag`, `dragEnd`, `resizeStart`, `resize`, `resizeEnd`
- Effect to register/unregister with store
- Type-specific styling via `[attr.data-event-type]`

**Template:**
```html
<div class="event-base" 
     [attr.data-event-type]="eventType()"
     [attr.data-read-only]="isReadOnly()">
  <ng-content /> <!-- Type-specific content -->
</div>
```

### 2.2 Specialized Event Components

#### [MODIFY] `features/event/event.ts` → Regular Event

**Keep existing logic**, extend from base:
```typescript
@Component({
  selector: 'mglon-event',
  template: `
    <mglon-event-base [eventType]="'event'">
      <span class="event-title">{{ title() }}</span>
    </mglon-event-base>
  `
})
```

**Inputs:** `start`, `end`, (all base inputs)  
**Outputs:** (all base outputs)

#### [NEW] `features/event/all-day-event/all-day-event.ts`

```typescript
@Component({
  selector: 'mglon-all-day-event',
  template: `
    <mglon-event-base [eventType]="'all-day'">
      <span class="event-title">{{ title() }}</span>
      @if (isMultiDay()) {
        <span class="duration-badge">{{ durationDays() }}d</span>
      }
    </mglon-event-base>
  `
})
```

**Inputs:** `date`, `endDate?`, (all base inputs)  
**Outputs:** (all base outputs)  
**Additional:** `durationDays` computed for multi-day events

#### [NEW] `features/event/recurrent-event/recurrent-event.ts`

```typescript
@Component({
  selector: 'mglon-recurrent-event',
  template: `
    <mglon-event-base [eventType]="'recurrent'">
      <div class="recurrence-indicator">🔄</div>
      <span class="event-title">{{ title() }}</span>
    </mglon-event-base>
  `
})
```

**Inputs:** `start`, `end`, `recurrenceRule`, (all base inputs)  
**Outputs:** (all base outputs + specific for recurrence)  
**Additional Output:** `editSeries` - emits when user wants to edit entire series

**Note:** Recurrent events are expanded to regular `Event` instances in the store, so this component is mainly for the **original/template event** or when showing in event list/settings.

### 2.3 Update Resource Events Container

#### [MODIFY] `features/resource/resource-events/resource-events.ts`

Update registration logic to handle all three types:
```typescript
ngAfterContentInit() {
  // Register Event components
  this.events().forEach(event => {
    this.store.addEvent({
      ...event,
      type: 'event',
      resourceId: this.resourceId()
    });
  });
  
  // Register AllDayEvent components
  this.allDayEvents().forEach(event => {
    this.store.addEvent({
      ...event,
      type: 'all-day',
      resourceId: this.resourceId()
    });
  });
  
  // Register RecurrentEvent components
  this.recurrentEvents().forEach(event => {
    this.store.addEvent({
      ...event,
      type: 'recurrent',
      resourceId: this.resourceId()
    });
  });
}
```

---

## Phase 3: MonthView - Visual Differentiation

### 3.1 Update Month Slot Component

#### [MODIFY] `features/month/month-slot/month-slot.ts`

Add computed for recurrence detection:
```typescript
readonly isRecurrence = computed(() => {
  const event = this.event();
  return event?.isRecurrenceInstance === true;
});
```

Update host bindings:
```typescript
host: {
  // ... existing bindings
  '[attr.data-is-recurrence]': 'isRecurrence()'
}
```

#### [MODIFY] `features/month/month-slot/month-slot.scss`

Add visual indicator for recurrences:
```scss
:host[data-is-recurrence="true"] {
  // Subtle repeating pattern
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
  
  // Or icon indicator
  &::before {
    content: '🔄';
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 10px;
    opacity: 0.6;
  }
}
```

### 3.2 No Changes to Positioning

MonthView treats all types the same for layout - only visual styling differs.

---

## Phase 4: Week/Resource Views - All-Day Row

### 4.1 Add All-Day Row Component

#### [NEW] `features/week/all-day-row/all-day-row.ts`

**Responsibilities:**
- Display all-day events in sticky header row
- Display multi-day regular events (span > 1 day)
- Collapse/expand when overflow
- Horizontal layout similar to MonthView weeks

**Template:**
```html
<div class="all-day-container" [class.collapsed]="isCollapsed()">
  <div class="all-day-label">All-day</div>
  <div class="all-day-events">
    @for (slot of slots(); track slot.id) {
      <mglon-month-slot [slot]="slot" /> <!-- Reuse month-slot for rendering -->
    }
  </div>
  @if (hasOverflow()) {
    <button class="toggle-btn" (click)="toggleExpand()">
      {{ isCollapsed() ? `+${hiddenCount()} more` : 'Show less' }}
    </button>
  }
</div>
```

**Computed:**
```typescript
readonly allDayEvents = computed(() => {
  return this.store.currentViewEvents()
    .filter(e => 
      e.type === 'all-day' || 
      this.isMultiDay(e)
    );
});

readonly slots = computed(() => {
  // Use month-event-slicer to create slots
  return sliceEventsByWeek(this.allDayEvents(), this.weekRange());
});
```

#### [NEW] `features/week/all-day-row/all-day-row.scss`

```scss
.all-day-container {
  position: sticky;
  top: 0;
  z-index: var(--mglon-schedule-z-sticky);
  background: var(--mglon-schedule-surface);
  border-bottom: 1px solid var(--mglon-schedule-border);
  max-height: 120px; // ~4 rows
  overflow: hidden;
  
  &.collapsed {
    max-height: 30px; // 1 row
  }
}
```

### 4.2 Integrate in Week View

#### [MODIFY] `features/week/week-view/week-view.html`

```html
<div class="week-container">
  <!-- Header with day labels -->
  <mglon-week-header />
  
  <!-- New: All-day events row (conditionally shown) -->
  @if (hasAllDayEvents()) {
    <mglon-all-day-row />
  }
  
  <!-- Existing time grid -->
  <mglon-week-grid />
</div>
```

### 4.3 Integrate in Resource View

#### [MODIFY] `features/resource/resource-view/resource-view.html`

Similar integration - add all-day row above the time grid.

---

## Phase 5: Interaction Handling

### 5.1 Drag/Drop for All-Day Events

**MonthView**: Works as-is (treated like regular events)  
**Week/Resource**: Dragging from all-day row to time grid converts to timed event

```typescript
// In AllDayRow component
onDragEnd(event: DragInteractionData) {
  if (this.isDroppedInTimeGrid(event)) {
    // Convert all-day to timed event
    this.store.updateEvent(event.eventId, {
      type: 'event',
      start: this.calculateStartTime(event.dropDate),
      end: this.calculateEndTime(event.dropDate)
    });
  }
}
```

### 5.2 Recurrence Edit Modal

When editing a recurrence instance, show modal:

```
┌─────────────────────────────────┐
│  Edit Recurring Event           │
├─────────────────────────────────┤
│  This is a recurring event.     │
│  What would you like to edit?   │
│                                 │
│  ○ Only this event              │
│  ○ This and following events    │
│  ○ All events in the series     │
│                                 │
│  [Cancel]  [Save]               │
└─────────────────────────────────┘
```

**Implementation:**
- Create exception for "only this event" (add to `recurrenceExceptions`)
- Split series for "this and following"
- Update template for "all events"

---

## Phase 6: Testing & Validation

### 6.1 Unit Tests

- ✅ `recurrence.service.spec.ts`: Cache behavior, expansion logic, exception handling
- ✅ `month-slot.spec.ts`: Recurrence visual indicator
- ✅ `all-day-row.spec.ts`: Event filtering, overflow logic
- ✅ `calendar.store.spec.ts`: `expandedEvents` computed

### 6.2 Integration Tests

- ✅ Create recurrent event in playground
- ✅ Navigate between months (verify cache hit/miss)
- ✅ Edit recurrence rule (verify cache invalidation)
- ✅ Drag all-day event to time slot (verify conversion)
- ✅ Test edge cases: last day of month, leap years, DST transitions

### 6.3 Performance Tests

- ✅ Create event with 1000 occurrences (verify 1000-event limit)
- ✅ Navigate quickly through 10 months (verify LRU eviction)
- ✅ Profile memory usage with cache enabled

---

## Verification Plan

### Automated Tests
```bash
# Run specific test suites
pnpm jest recurrence.service.spec.ts
pnpm jest all-day-row.spec.ts
pnpm jest calendar.store.spec.ts --testNamePattern="expandedEvents"
```

### Manual Verification

**Playground Scenarios:**
1. Create "Weekly on Mon/Wed/Fri for 10 weeks" event
2. Navigate to next month → verify events appear correctly
3. Go back to previous month → verify cache hit (instant load)
4. Edit recurrence rule → verify all instances update
5. Create all-day event spanning 3 days
6. Switch to Week view → verify appears in all-day row
7. Drag all-day event to 2pm time slot → verify converts to timed event

---

## Migration & Backward Compatibility

### Existing Events
All existing `mglon-event` components continue to work (type defaults to `'event'`).

### gradual Adoption
```html
<!-- Old (still works) -->
<mglon-event id="e1" ... />

<!-- New (explicit types) -->
<mglon-all-day-event id="e2" ... />
<mglon-recurrent-event id="e3" ... />
```

---

## Performance Considerations

| Concern | Mitigation |
|---------|------------|
| **Cache memory** | Max 3 pages × 1000 events = ~3000 events in memory |
| **Expansion cost** | Cached after first calculation, LRU eviction |
| **Re-renders** | Angular signals ensure only affected components update |
| **Large series** | Hard limit of 1000 events per page with console warning |

---

## Future Enhancements

- [ ] Support `BYHOUR`/`BYMINUTE` for intra-day recurrences
- [ ] Add "Edit Series" UI for bulk modifications
- [ ] Export recurrence as iCalendar (.ics) file
- [ ] Import external recurrence rules from Google Calendar API
- [ ] Visual timeline showing recurrence pattern in event details

---

## Dependencies

- ✅ `rrule` ^2.8.1 (or latest)
- ✅ `date-fns` (already installed)

---

## Estimated Timeline

- **Phase 1 (Foundation)**: 2-3 days
- **Phase 2 (Components)**: 2 days
- **Phase 3 (MonthView)**: 1 day
- **Phase 4 (Week/Resource)**: 2-3 days
- **Phase 5 (Interactions)**: 2 days
- **Phase 6 (Testing)**: 2 days

**Total**: ~2 weeks for complete implementation
