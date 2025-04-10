import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_shared/form-inputs/text-input/text-input.component';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { CheckboxInputComponent } from "../../_shared/form-inputs/checkbox-input/checkbox-input.component";
import { DateFormatDirective } from '../../_directives/date-format.directive';
import { LegalFileService } from '../../_services/legal-file.service';
import { UserService } from '../../_services/user.service';
import { Attorney } from '../../_models/attorney.model';

@Component({
  selector: 'app-file-create',
  standalone: true,
  imports: [CommonModule, TextInputComponent, ReactiveFormsModule, DropdownInputComponent, CheckboxInputComponent, DateFormatDirective],
  templateUrl: './file-create.component.html',
  styleUrl: './file-create.component.css'
})
export class FileCreateComponent {
  @Output() cancelRegister = new EventEmitter();

  fileCreateForm: FormGroup = new FormGroup({});


  public legalFileService = inject(LegalFileService);
  public userService = inject(UserService);

  attorneys: string[] = [];
  fileTypes = ['Discovery Watching Brief','Discovery Health General', 'General MVA','Corrospondents','Referrals','Loss of Support', 'Slip and Fall']
  status = ['Pre-Lodgement', 'Lodged', 'Summons', 'Pleadings Closed', 'Rule 37 Complience', 'Judical Case Management', 'Trial Date', 'Settled']

  constructor(
    private fb: FormBuilder
    //private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.getAttorneys(); //string[]
    this.initializeForm();
  }

  initializeForm() {
    this.fileCreateForm = this.fb.group({
      fileReference: ['', Validators.required],
      clientReference: ['', Validators.required],
      fullName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfInstruction: ['', this.dateValidator],
      dateOfAccident: ['', this.dateValidator],
      status: ['', Validators.required],
      fileType: [''],
      ownerId: ['', Validators.required],
    });
  }

  getAttorneys() {
    this.userService.getAttorneys().subscribe((attorneys: Attorney[]) => {
      this.attorneys = attorneys.map(attorney => attorney.userName);
    });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(value)) {
      return { dateInvalid: true };
    }
    return null;
  }

  onSubmit(){
    if (this.fileCreateForm.valid) {
      this.legalFileService.addLegalFile(this.fileCreateForm.value);
      this.cancel();
    }

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
