import { Component, inject } from '@angular/core';
import { SlideOverComponent } from '../../_shared/slide-over/slide-over.component';
import { FileCreateComponent } from '../file-create/file-create.component';
import { FileUpdateComponent } from '../file-update/file-update.component';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent } from '../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { LegalFileService } from '../../_services/legal-file.service';
import { LegalFile } from '../../_models/legalFile.model';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';

@Component({
  selector: 'app-file-overview',
  standalone: true,
  imports: [SlideOverComponent, CommonModule, FileCreateComponent, FileUpdateComponent, CheckboxInputComponent, DropdownInputComponent],
  templateUrl: './file-overview.component.html',
  styleUrl: './file-overview.component.css'
})
export class FileOverviewComponent {
  registerMode = false;
  selectedFile!: LegalFile;
  editMode = false;
  panelTitle = 'Add new file';
  public legalFileService = inject(LegalFileService);


  ngOnInit(): void {
    // if (this.legalFileService.paginatedResult()?.items?.length)
    this.loadLegalFiles();
  }

  addFile(){
    this.panelTitle = 'Add new file';
    this.editMode = false;
    this.registerMode = true;
  }

  loadLegalFiles() {
    this.legalFileService.getLegalFiles();
  }

  updateLegalFile(file: LegalFile) {
    this.selectedFile = file;
    this.panelTitle = 'Edit file';
    this.registerMode = false;
    this.editMode = true;
  }

  // editUser(user: User) {
  // editUser(user: UserWithRoles) {
  //   this.user = user;
  //   this.panelTitle = 'Edit user';
  //   this.registerMode = false;
  //   this.editMode = true;
  // }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.editMode = event;
  }

  cancelEditMode(event: boolean) {
    this.editMode = event;
    this.registerMode = event;
  }

}
