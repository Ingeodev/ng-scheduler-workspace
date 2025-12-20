import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, IconButtonComponent, FabButtonComponent, ButtonGroupComponent } from 'ng-scheduler';
import { ApiTableComponent, ApiProperty } from '../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../shared/code-block/code-block';
import { ExampleViewerComponent } from '../../shared/example-viewer/example-viewer';

@Component({
  selector: 'app-buttons-doc',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent, IconButtonComponent, ButtonGroupComponent,
    ExampleViewerComponent
  ],
  templateUrl: './button-doc.html'
})
export class ButtonsDocComponent {
  buttonExampleCode = `
<button mglon-button color="primary">Primary</button>
<button mglon-button color="secondary">Secondary</button>
<button mglon-button appereance="outline">Outline</button>
<button mglon-button appereance="ghost">Ghost</button>
  `;

  iconButtonExampleCode = `
<button mglon-icon-button>
  <span class="material-icons">settings</span>
</button>
<button mglon-icon-button appereance="solid" color="primary">
  <span class="material-icons">edit</span>
</button>
  `;

  groupExampleCode = `
<mglon-button-group>
  <button mglon-button [active]="selected === 'day'" (click)="selected = 'day'">Day</button>
  <button mglon-button [active]="selected === 'week'" (click)="selected = 'week'">Week</button>
  <button mglon-button [active]="selected === 'month'" (click)="selected = 'month'">Month</button>
</mglon-button-group>
  `;
}
