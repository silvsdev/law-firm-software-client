import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.css'
})
export class CheckboxInputComponent implements OnInit {
  @Input() label = '';
  @Input() options: { [option: string]: boolean } = {};
  selectedOptions: string[] = [];

  opendropdown = false;
  value: string = 'none selected';

  currentPage: number = 1;
  optionsPerPage: number = 5;
  totalPages: number = 0;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.totalPages = Math.ceil(Object.keys(this.options).length / this.optionsPerPage);
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  selectOption(option: string) {
    if(this.options[option] === true){
      this.options[option] = false;
    }
    else {
      this.options[option] = true;
    }
  }

  get paginatedOptions(): { [option: string]: boolean } {
    const sortedKeys = Object.keys(this.options).sort();
    const startIndex = (this.currentPage - 1) * this.optionsPerPage;
    const endIndex = startIndex + this.optionsPerPage;
    const keys = sortedKeys.slice(startIndex, endIndex);
    const paginatedOptions: { [option: string]: boolean } = {};
    keys.forEach(key => {
      paginatedOptions[key] = this.options[key];
    });
    return paginatedOptions;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}

