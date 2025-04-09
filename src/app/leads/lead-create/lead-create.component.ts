import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../_services/lead.service';
import { Lead } from '../../_models/lead.model';
import { NotificationService } from '../../_services/notification.service';
import { LeadAdd } from '../../_models/LeadAdd.model';
import { CheckboxInputComponent } from '../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { TextInputComponent } from '../../_shared/form-inputs/text-input/text-input.component';
import { DropdownInputComponent } from "../../_shared/form-inputs/dropdown-input/dropdown-input.component";


@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [TextInputComponent, CheckboxInputComponent, ReactiveFormsModule, CommonModule, DropdownInputComponent],
  templateUrl: './lead-create.component.html',
  styleUrl: './lead-create.component.css'
})
export class LeadCreateComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  @Input() emptyLead: any;

  leadCreateForm: FormGroup = new FormGroup({});

  preferredContactMethodOptions = [
    'Email',
    'Phone'
  ];

  preferredLanguageOptions = [
    'English',
    'Afrikaans',
    'Zulu'
  ];

  sourceOptions = [
    'Phone',
    'Email',
    'Discovery'
  ];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.leadCreateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      preferredContactMethod: ['', Validators.required],
      preferredLanguage: ['', Validators.required],
      accidentDate: ['', Validators.required],
      source: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.leadCreateForm.invalid) {
      this.leadCreateForm.markAllAsTouched();
      return;
    }

    const lead: LeadAdd = {
      name: this.leadCreateForm.get('name')!.value,
      email: this.leadCreateForm.get('email')!.value,
      phone: this.leadCreateForm.get('phone')!.value,
      preferredContactMethod: this.leadCreateForm.get('preferredContactMethod')!.value,
      preferredLanguage: this.leadCreateForm.get('preferredLanguage')!.value,
      accidentDate: this.leadCreateForm.get('accidentDate')!.value,
      source: this.leadCreateForm.get('source')!.value
    };

    this.leadService.addLead(lead);
    this.cancel();
  }

  cancel() {
    this.cancelRegister.emit();
  }
}
