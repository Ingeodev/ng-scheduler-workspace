import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Schedule, SchedulerConfig } from 'ng-scheduler';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Schedule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('playground');

  config: Partial<SchedulerConfig> = {
    initialView: 'resource',
    initialDate: new Date()
  };
}
