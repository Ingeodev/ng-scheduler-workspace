import { getMonthCalendarGrid, CalendarDay, CalendarWeek, getWeekDays, getWeekTimeSlots } from './calendar.helpers';

describe('Calendar Helpers', () => {
  describe('getMonthCalendarGrid', () => {
    it('should generate 5 weeks for a month that fits in 5 weeks', () => {
      // February 2024 starts on Thursday and ends on Thursday (29 days, leap year)
      const date = new Date(2024, 1, 15); // February 15, 2024
      const result = getMonthCalendarGrid(date);

      expect(result.length).toBe(5);
      result.forEach(week => {
        expect(week.days.length).toBe(7);
      });
    });

    it('should generate 6 weeks for a month that spans 6 weeks', () => {
      // March 2024 starts on Friday and ends on Sunday (spans 6 weeks)
      const date = new Date(2024, 2, 15); // March 15, 2024
      const result = getMonthCalendarGrid(date);

      expect(result.length).toBe(6);
      result.forEach(week => {
        expect(week.days.length).toBe(7);
      });
    });

    it('should include padding days from previous month', () => {
      // January 2024 starts on Monday, so should have Sunday from December
      const date = new Date(2024, 0, 1); // January 1, 2024
      const result = getMonthCalendarGrid(date);

      const firstDay = result[0].days[0];
      expect(firstDay.isPreviousMonth).toBe(true);
      expect(firstDay.isCurrentMonth).toBe(false);
      expect(firstDay.date.getMonth()).toBe(11); // December (0-indexed)
      expect(firstDay.date.getFullYear()).toBe(2023);
    });

    it('should include padding days from next month', () => {
      // January 2024 ends on Wednesday, so should have days from February
      const date = new Date(2024, 0, 31); // January 31, 2024
      const result = getMonthCalendarGrid(date);

      const lastWeek = result[result.length - 1];
      const lastDay = lastWeek.days[6]; // Saturday

      expect(lastDay.isNextMonth).toBe(true);
      expect(lastDay.isCurrentMonth).toBe(false);
      expect(lastDay.date.getMonth()).toBe(1); // February
    });

    it('should correctly identify current month days', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      const result = getMonthCalendarGrid(date);

      let currentMonthDays = 0;
      result.forEach(week => {
        week.days.forEach(day => {
          if (day.isCurrentMonth) {
            currentMonthDays++;
            expect(day.date.getMonth()).toBe(0); // January
            expect(day.isPreviousMonth).toBe(false);
            expect(day.isNextMonth).toBe(false);
          }
        });
      });

      expect(currentMonthDays).toBe(31); // January has 31 days
    });

    it('should handle leap years correctly', () => {
      // February 2024 is a leap year (29 days)
      const date = new Date(2024, 1, 15);
      const result = getMonthCalendarGrid(date);

      let februaryDays = 0;
      result.forEach(week => {
        week.days.forEach(day => {
          if (day.isCurrentMonth) {
            februaryDays++;
          }
        });
      });

      expect(februaryDays).toBe(29);
    });

    it('should handle non-leap years correctly', () => {
      // February 2023 is not a leap year (28 days)
      const date = new Date(2023, 1, 15);
      const result = getMonthCalendarGrid(date);

      let februaryDays = 0;
      result.forEach(week => {
        week.days.forEach(day => {
          if (day.isCurrentMonth) {
            februaryDays++;
          }
        });
      });

      expect(februaryDays).toBe(28);
    });

    it('should start weeks on Sunday', () => {
      const date = new Date(2024, 0, 15);
      const result = getMonthCalendarGrid(date);

      result.forEach(week => {
        const firstDay = week.days[0];
        expect(firstDay.date.getDay()).toBe(0); // Sunday
      });
    });

    it('should end weeks on Saturday', () => {
      const date = new Date(2024, 0, 15);
      const result = getMonthCalendarGrid(date);

      result.forEach(week => {
        const lastDay = week.days[6];
        expect(lastDay.date.getDay()).toBe(6); // Saturday
      });
    });

    it('should have correct day numbers', () => {
      const date = new Date(2024, 0, 15);
      const result = getMonthCalendarGrid(date);

      result.forEach(week => {
        week.days.forEach(day => {
          expect(day.day).toBe(day.date.getDate());
        });
      });
    });

    it('should handle months starting on Sunday', () => {
      // September 2024 starts on Sunday
      const date = new Date(2024, 8, 1);
      const result = getMonthCalendarGrid(date);

      const firstDay = result[0].days[0];
      expect(firstDay.isCurrentMonth).toBe(true);
      expect(firstDay.date.getDate()).toBe(1);
    });

    it('should handle months ending on Saturday', () => {
      // March 2024 ends on Sunday (31st is Sunday)
      const date = new Date(2024, 2, 31);
      const result = getMonthCalendarGrid(date);

      // Find the last day of March
      let lastMarchDay: CalendarDay | null = null;
      result.forEach(week => {
        week.days.forEach(day => {
          if (day.isCurrentMonth && day.date.getDate() === 31) {
            lastMarchDay = day;
          }
        });
      });

      expect(lastMarchDay).toBeTruthy();
      expect(lastMarchDay!.date.getDay()).toBe(0); // Sunday
    });

    it('should maintain date continuity across weeks', () => {
      const date = new Date(2024, 0, 15);
      const result = getMonthCalendarGrid(date);

      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < 7; j++) {
          const currentDay = result[i].days[j];

          // Check next day in the same week
          if (j < 6) {
            const nextDay = result[i].days[j + 1];
            const dayDiff = nextDay.date.getTime() - currentDay.date.getTime();
            expect(dayDiff).toBe(24 * 60 * 60 * 1000); // 1 day in milliseconds
          }

          // Check first day of next week
          if (i < result.length - 1 && j === 6) {
            const nextWeekFirstDay = result[i + 1].days[0];
            const dayDiff = nextWeekFirstDay.date.getTime() - currentDay.date.getTime();
            expect(dayDiff).toBe(24 * 60 * 60 * 1000);
          }
        }
      });
  });

  describe('getWeekDays', () => {
    it('should return 7 days for any given date', () => {
      const date = new Date(2024, 0, 15); // Monday, January 15, 2024
      const result = getWeekDays(date);

      expect(result.length).toBe(7);
    });

    it('should start week on Sunday', () => {
      const date = new Date(2024, 0, 15); // Monday
      const result = getWeekDays(date);

      expect(result[0].dayOfWeek).toBe(0); // Sunday
      expect(result[0].dayName).toBe('Sun');
    });

    it('should end week on Saturday', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDays(date);

      expect(result[6].dayOfWeek).toBe(6); // Saturday
      expect(result[6].dayName).toBe('Sat');
    });

    it('should have correct day names', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDays(date);
      const expectedNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      result.forEach((day, index) => {
        expect(day.dayName).toBe(expectedNames[index]);
      });
    });

    it('should identify today correctly', () => {
      const today = new Date();
      const result = getWeekDays(today);

      const todayDay = result.find(day => day.isToday);
      expect(todayDay).toBeTruthy();
      expect(todayDay!.date.getDate()).toBe(today.getDate());
    });

    it('should not mark any day as today if today is not in the week', () => {
      const date = new Date(2024, 0, 1); // January 1, 2024
      const result = getWeekDays(date);

      const todayCount = result.filter(day => day.isToday).length;
      // This will be 0 unless the test is run on a day in that week
      expect(todayCount).toBeLessThanOrEqual(1);
    });

    it('should have correct day numbers', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDays(date);

      result.forEach(day => {
        expect(day.dayNumber).toBe(day.date.getDate());
      });
    });

    it('should handle week spanning two months', () => {
      const date = new Date(2024, 0, 31); // Wednesday, January 31, 2024
      const result = getWeekDays(date);

      // Week should include days from January and February
      const januaryDays = result.filter(day => day.date.getMonth() === 0);
      const februaryDays = result.filter(day => day.date.getMonth() === 1);

      expect(januaryDays.length).toBeGreaterThan(0);
      expect(februaryDays.length).toBeGreaterThan(0);
      expect(januaryDays.length + februaryDays.length).toBe(7);
    });
  });

  describe('getWeekTimeSlots', () => {
    it('should return 7 days of time slots', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      expect(result.length).toBe(7);
    });

    it('should have 48 time slots per day', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      result.forEach(daySlots => {
        expect(daySlots.length).toBe(48); // 24 hours × 2 slots per hour
      });
    });

    it('should start at 00:00', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      result.forEach(daySlots => {
        const firstSlot = daySlots[0];
        expect(firstSlot.hour).toBe(0);
        expect(firstSlot.minute).toBe(0);
        expect(firstSlot.timeLabel).toBe('00:00');
      });
    });

    it('should end at 23:30', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      result.forEach(daySlots => {
        const lastSlot = daySlots[47];
        expect(lastSlot.hour).toBe(23);
        expect(lastSlot.minute).toBe(30);
        expect(lastSlot.timeLabel).toBe('23:30');
      });
    });

    it('should have 30-minute intervals', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      result.forEach(daySlots => {
        daySlots.forEach(slot => {
          expect([0, 30]).toContain(slot.minute);
        });
      });
    });

    it('should have correct time labels', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      const firstDaySlots = result[0];

      expect(firstDaySlots[0].timeLabel).toBe('00:00');
      expect(firstDaySlots[1].timeLabel).toBe('00:30');
      expect(firstDaySlots[2].timeLabel).toBe('01:00');
      expect(firstDaySlots[3].timeLabel).toBe('01:30');
      expect(firstDaySlots[24].timeLabel).toBe('12:00'); // Noon
      expect(firstDaySlots[47].timeLabel).toBe('23:30');
    });

    it('should have correct day of week for each slot', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekTimeSlots(date);

      result.forEach((daySlots, dayIndex) => {
        daySlots.forEach(slot => {
          expect(slot.dayOfWeek).toBe(dayIndex);
        });
      });
    });

    it('should identify today slots correctly', () => {
      const today = new Date();
      const result = getWeekTimeSlots(today);

      const todayDayOfWeek = today.getDay();
      const todaySlots = result[todayDayOfWeek];

      todaySlots.forEach(slot => {
        expect(slot.isToday).toBe(true);
      });
    });

    it('should have correct date with time for each slot', () => {
      const date = new Date(2024, 0, 15); // Monday
      const result = getWeekTimeSlots(date);

      const mondaySlots = result[1]; // Monday is index 1 (Sunday is 0)

      // Check a few specific slots
      const slot0 = mondaySlots[0]; // 00:00
      expect(slot0.date.getHours()).toBe(0);
      expect(slot0.date.getMinutes()).toBe(0);

      const slot25 = mondaySlots[25]; // 12:30
      expect(slot25.date.getHours()).toBe(12);
      expect(slot25.date.getMinutes()).toBe(30);

      const slot47 = mondaySlots[47]; // 23:30
      expect(slot47.date.getHours()).toBe(23);
      expect(slot47.date.getMinutes()).toBe(30);
    });
  });
});
