import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateFormat]',
  standalone: true
})
export class DateFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digit characters

    if (value.length > 2) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 9);
    }

    input.value = value;
  }
}
