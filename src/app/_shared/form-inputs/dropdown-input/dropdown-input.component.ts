import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.css'
})
export class DropdownInputComponent implements ControlValueAccessor{
  @Input() label = '';
  @Input() options: string[] = [];
  @Input() value: string = "none selected";

  opendropdown = false;
  // value: string = "none selected";

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  selectOption(option: any) {
    this.value = option;
    this.opendropdown = false;
    this.control.setValue(option);
  }

}

