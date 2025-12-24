import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZigzagDirective } from './zigzag.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div [mglonZigzag]="sides" [zigzagSize]="size"></div>
  `,
  imports: [ZigzagDirective],
  standalone: true
})
class TestComponent {
  sides: string | string[] = 'left';
  size = '5px';
}

describe('ZigzagDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ZigzagDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply class for single side', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.classList).toContain('mglon-zigzag-left');
  });

  it('should apply classes for multiple sides', () => {
    component.sides = ['top', 'right'];
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.classList).toContain('mglon-zigzag-top');
    expect(div.classList).toContain('mglon-zigzag-right');
    expect(div.classList).not.toContain('mglon-zigzag-left');
  });

  it('should set css variable for size', () => {
    component.size = '10px';
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.style.getPropertyValue('--mglon-zigzag-size')).toBe('10px');
  });
});
