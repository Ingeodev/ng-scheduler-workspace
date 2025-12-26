import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AllDayDirective } from './all-day.directive';
import { IconComponent } from '../../../shared/components/icon/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [AllDayDirective],
  template: `
    <div [mglonAllDay]="isAllDay()" [dotColor]="color()">Test Event</div>
  `
})
class TestComponent {
  isAllDay = signal(false);
  color = signal('#ff0000');
}

describe('AllDayDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, AllDayDirective, IconComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
            sanitize: (ctx: any, val: any) => val
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.directive(AllDayDirective));
  });

  it('should not apply all-day class or inject icon when isAllDay is false', () => {
    const el = debugElement.nativeElement;
    expect(el.classList.contains('mglon-event--all-day')).toBe(false);

    const icon = el.querySelector('mglon-icon');
    expect(icon).toBeNull();
  });

  it('should apply all-day class and inject dot icon when isAllDay is true', () => {
    component.isAllDay.set(true);
    fixture.detectChanges();

    const el = debugElement.nativeElement;
    expect(el.classList.contains('mglon-event--all-day')).toBe(true);

    const icon = el.querySelector('mglon-icon');
    expect(icon).toBeTruthy();

    const iconDebugEl = fixture.debugElement.query(By.directive(IconComponent));
    expect(iconDebugEl.componentInstance.name()).toBe('dot');
  });

  it('should update dot color when dotColor input changes', () => {
    component.isAllDay.set(true);
    component.color.set('rgb(0, 255, 0)');
    fixture.detectChanges();

    const icon = debugElement.nativeElement.querySelector('mglon-icon');
    expect(icon.style.color).toBe('rgb(0, 255, 0)');
  });
});
