import { Component, signal } from '@angular/core';
import { Schedule, SchedulerConfig, ButtonComponent, ButtonGroupComponent, FabButtonComponent, IconButtonComponent } from 'ng-scheduler';

@Component({
  selector: 'app-root',
  imports: [Schedule, ButtonComponent, ButtonGroupComponent, FabButtonComponent, IconButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'playground';

  demoValue = 'month';

  config: SchedulerConfig = {
    initialView: 'week',
    initialDate: new Date()
  };
}
