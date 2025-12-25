import { CalendarStore } from './calendar.store'
import { TestBed } from '@angular/core/testing'
import { DEFAULT_UI_CONFIG } from '../models/ui-config'

describe('CalendarStore - UI Config', () => {
  let store: InstanceType<typeof CalendarStore>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarStore]
    })
    store = TestBed.inject(CalendarStore)
  })

  describe('setUIConfig', () => {
    describe('grid configuration', () => {
      it('should merge eventSlots rounded configuration', () => {
        store.setUIConfig({
          grid: {
            eventSlots: {
              rounded: 'none'
            }
          }
        })

        expect(store.uiConfig().grid.eventSlots.rounded).toBe('none')
      })

      it('should merge eventSlots rounded to sm', () => {
        store.setUIConfig({
          grid: {
            eventSlots: {
              rounded: 'sm'
            }
          }
        })

        expect(store.uiConfig().grid.eventSlots.rounded).toBe('sm')
      })

      it('should merge eventSlots rounded to full', () => {
        store.setUIConfig({
          grid: {
            eventSlots: {
              rounded: 'full'
            }
          }
        })

        expect(store.uiConfig().grid.eventSlots.rounded).toBe('full')
      })

      it('should preserve default values when partial config provided', () => {
        const defaultRounded = DEFAULT_UI_CONFIG.grid.eventSlots.rounded

        store.setUIConfig({
          header: {
            buttonGroup: {
              appearance: 'ghost'
            }
          }
        })

        // Grid config should remain unchanged
        expect(store.uiConfig().grid.eventSlots.rounded).toBe(defaultRounded)
      })

      it('should merge overflowIndicator configuration', () => {
        store.setUIConfig({
          grid: {
            overflowIndicator: {
              appearance: 'solid',
              rounded: 'none'
            }
          }
        })

        expect(store.uiConfig().grid.overflowIndicator.appearance).toBe('solid')
        expect(store.uiConfig().grid.overflowIndicator.rounded).toBe('none')
      })
    })

    describe('header configuration', () => {
      it('should merge buttonGroup appearance', () => {
        store.setUIConfig({
          header: {
            buttonGroup: {
              appearance: 'solid'
            }
          }
        })

        expect(store.uiConfig().header.buttonGroup.appearance).toBe('solid')
      })

      it('should merge todayButton rounded', () => {
        store.setUIConfig({
          header: {
            todayButton: {
              rounded: 'full'
            }
          }
        })

        expect(store.uiConfig().header.todayButton.rounded).toBe('full')
      })

      it('should merge iconButtons configuration', () => {
        store.setUIConfig({
          header: {
            iconButtons: {
              rounded: 'none'
            }
          }
        })

        expect(store.uiConfig().header.iconButtons.rounded).toBe('none')
      })
    })

    describe('sidebar configuration', () => {
      it('should merge resourceItems configuration', () => {
        store.setUIConfig({
          sidebar: {
            resourceItems: {
              rounded: 'none',
              density: 'compact'
            }
          }
        })

        expect(store.uiConfig().sidebar.resourceItems.rounded).toBe('none')
        expect(store.uiConfig().sidebar.resourceItems.density).toBe('compact')
      })
    })

    describe('combined configurations', () => {
      it('should merge all areas simultaneously', () => {
        store.setUIConfig({
          header: {
            buttonGroup: { appearance: 'ghost' }
          },
          sidebar: {
            resourceItems: { rounded: 'sm' }
          },
          grid: {
            eventSlots: { rounded: 'none' }
          }
        })

        expect(store.uiConfig().header.buttonGroup.appearance).toBe('ghost')
        expect(store.uiConfig().sidebar.resourceItems.rounded).toBe('sm')
        expect(store.uiConfig().grid.eventSlots.rounded).toBe('none')
      })
    })
  })
})
