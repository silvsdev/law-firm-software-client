import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_shared/form-inputs/text-input/text-input.component';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { LegalFileService } from '../../_services/legal-file.service';
import { UserService } from '../../_services/user.service';
import { LegalFile } from '../../_models/legalFile.model';
import { DateFormatDirective } from '../../_directives/date-format.directive';
import { Attorney } from '../../_models/attorney.model';

@Component({
  selector: 'app-file-update',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule, DropdownInputComponent, DateFormatDirective],
  templateUrl: './file-update.component.html',
  styleUrl: './file-update.component.css'
})
export class FileUpdateComponent {
  @Input() legalFile!: LegalFile;
  @Output() cancelUpdate = new EventEmitter();

  public legalFileService = inject(LegalFileService);
  public userService = inject(UserService);

  fileEditForm: FormGroup = new FormGroup({});
  attorneys: string[] = [];
  fileTypes = ['Discovery Watching Brief','Discovery Health General', 'General MVA','Corrospondents','Referrals','Loss of Support', 'Slip and Fall']
  status = ['Pre-Lodgement', 'Lodged', 'Summons', 'Pleadings Closed', 'Rule 37 Complience', 'Judical Case Management', 'Trial Date', 'Settled']

  constructor(
    private fb: FormBuilder
    //private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.getAttorneys();
    this.initializeForm();
  }

  initializeForm() {
    this.fileEditForm = this.fb.group({
      fileReference: [this.legalFile.fileReference, Validators.required],
      clientReference: [this.legalFile.clientReference, Validators.required],
      fullName: [this.legalFile.fullName, Validators.required],
      lastName: [this.legalFile.lastName, Validators.required],
      dateOfInstruction: [this.legalFile.dateOfInstruction, this.dateValidator],
      dateOfAccident: [this.legalFile.dateOfAccident, this.dateValidator],
      status: [this.legalFile.status, Validators.required],
      fileType: [this.legalFile.fileType],
      ownerId: [this.legalFile.ownerId, Validators.required],
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

  getAttorneys() {
    this.userService.getAttorneys().subscribe((attorneys: Attorney[]) => {
      this.attorneys = attorneys.map(attorney => attorney.userName);
    });
  }

  onSubmit(){
    if (this.fileEditForm.valid) {
      const LegalFileUpdate = {
        id: this.legalFile.id,
        fileReference: this.fileEditForm.value.fileReference,
        clientReference: this.fileEditForm.value.clientReference,
        fullName: this.fileEditForm.value.fullName,
        lastName: this.fileEditForm.value.lastName,
        dateOfInstruction: this.fileEditForm.value.dateOfInstruction,
        dateOfAccident: this.fileEditForm.value.dateOfAccident,
        status: this.fileEditForm.value.status,
        fileType: this.fileEditForm.value.fileType,
        ownerId: this.fileEditForm.value.ownerId,
      }
      this.legalFileService.updateLegalFile(LegalFileUpdate)
      this.cancel();
    }

  }

  cancel() {
    this.cancelUpdate.emit(false);
  }

  delete() {
    this.legalFileService.deleteLegalFile(parseInt(this.legalFile.id, 10));
    this.cancel();
  }

}
