import { Component } from '@angular/core';

@Component({
  selector: 'mglon-month-header',
  imports: [],
  templateUrl: './month-header.html',
  styleUrl: './month-header.scss',
})
export class MonthHeader {

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

}
