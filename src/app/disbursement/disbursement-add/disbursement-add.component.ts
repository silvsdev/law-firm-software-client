import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Disbursement } from '../../_models/disbursement.model';
import { NotificationService } from '../../_services/notification.service';
import { TextInputComponent } from '../../_shared/form-inputs/text-input/text-input.component';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { DisbursementService } from '../../_services/disbursement.service';

@Component({
  selector: 'app-disbursement-add',
  standalone: true,
  imports: [TextInputComponent, DropdownInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './disbursement-add.component.html',
  styleUrl: './disbursement-add.component.css'
})
export class DisbursementAddComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  @Input() emptyDisbursement: any;
  legalFileId: number = 0;
  @Input() legalFile!: number;

  disbursementCreateForm: FormGroup = new FormGroup({});

  metricOptions = [
    'Travel',
    'Incoming Email',
    'Outgoing Email',
    'B&W Copy',
    'Colour Copy',
    'Lever Arch File'
  ];

  constructor(
    private fb: FormBuilder,
    private disbursementService: DisbursementService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.disbursementCreateForm = this.fb.group({
      metric: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.disbursementCreateForm.invalid) {
      this.disbursementCreateForm.markAllAsTouched();
      return;
    }

    const disbursement: Disbursement = {
      LegalFileId: this.legalFile,
      metric: this.disbursementCreateForm.get('metric')!.value,
      quantity: this.disbursementCreateForm.get('quantity')!.value,
      price: this.disbursementCreateForm.get('metric')!.value === 'Travel' ? 4.50 * this.disbursementCreateForm.get('quantity')!.value :
             this.disbursementCreateForm.get('metric')!.value === 'Incoming Email' ? 3.50 * this.disbursementCreateForm.get('quantity')!.value :
             this.disbursementCreateForm.get('metric')!.value === 'Outgoing Email' ? 2.50 * this.disbursementCreateForm.get('quantity')!.value :
             this.disbursementCreateForm.get('metric')!.value === 'B&W Copy' ? 7.00 * this.disbursementCreateForm.get('quantity')!.value :
             this.disbursementCreateForm.get('metric')!.value === 'Lever Arch File' ? 45.00 * this.disbursementCreateForm.get('quantity')!.value :
             this.disbursementCreateForm.get('metric')!.value === 'Colour Copy' ? 8.50 * this.disbursementCreateForm.get('quantity')!.value : 0
    };

    this.disbursementService.addDisbursement(disbursement);
  }

  cancel() {
    this.cancelRegister.emit();
  }
}
