import { Routes } from '@angular/router';
import { DocsLayoutComponent } from './docs/layout/docs-layout';
import { IntroComponent } from './docs/pages/intro/intro';
import { ScheduleDocComponent } from './docs/pages/schedule-doc/schedule-doc';
import { ButtonsDocComponent } from './docs/pages/button-doc/button-doc';
import { SchedulerConfigDocComponent } from './docs/pages/api/scheduler-config/scheduler-config';
import { ResourceModelDocComponent } from './docs/pages/api/resource-model/resource-model';
import { ViewModeDocComponent } from './docs/pages/api/view-mode/view-mode';

export const routes: Routes = [
  {
    path: 'docs',
    component: DocsLayoutComponent,
    children: [
      { path: '', redirectTo: 'introduction', pathMatch: 'full' },
      { path: 'introduction', component: IntroComponent },
      { path: 'components/schedule', component: ScheduleDocComponent },
      { path: 'components/buttons', component: ButtonsDocComponent },
      { path: 'api/scheduler-config', component: SchedulerConfigDocComponent },
      { path: 'api/resource-model', component: ResourceModelDocComponent },
      { path: 'api/view-mode', component: ViewModeDocComponent }
    ]
  },

  { path: '', redirectTo: 'docs', pathMatch: 'full' }
];
