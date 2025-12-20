import { getMonthCalendarGrid, CalendarDay, CalendarWeek } from './calendar.helpers';

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
      }
    });
  });
});
