import { Component, inject, OnInit, HostListener } from '@angular/core';
import { SlideOverComponent } from '../../_shared/slide-over/slide-over.component';
import { FileCreateComponent } from '../file-create/file-create.component';
import { FileUpdateComponent } from '../file-update/file-update.component';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent } from '../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { LegalFileService } from '../../_services/legal-file.service';
import { LegalFile } from '../../_models/legalFile.model';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { UserService } from '../../_services/user.service';
import { Attorney } from '../../_models/attorney.model';

@Component({
  selector: 'app-file-overview',
  standalone: true,
  imports: [SlideOverComponent, CommonModule, FileCreateComponent, FileUpdateComponent, CheckboxInputComponent, DropdownInputComponent],
  templateUrl: './file-overview.component.html',
  styleUrl: './file-overview.component.css'
})
export class FileOverviewComponent implements OnInit {
  registerMode = false;
  selectedFile!: LegalFile;
  editMode = false;
  panelTitle = 'Add new file';
  dropdownOpen = false;
  selectedAttorneys: Set<number> = new Set();

  public legalFileService = inject(LegalFileService);
  public userService = inject(UserService);

  attorneys: Attorney[] = [];

  ngOnInit(): void {
    this.getAttorneys();
    this.loadLegalFiles();
  }

  addFile() {
    this.panelTitle = 'Add new file';
    this.editMode = false;
    this.registerMode = true;
  }

  loadLegalFiles() {
    this.legalFileService.getLegalFiles();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  updateLegalFile(file: LegalFile) {
    this.selectedFile = file;
    this.panelTitle = 'Edit file';
    this.registerMode = false;
    this.editMode = true;
  }

  getAttorneys() {
    this.userService.getAttorneys().subscribe((attorneys: Attorney[]) => {
      this.attorneys = attorneys;
      this.selectedAttorneys = new Set(attorneys.map(attorney => attorney.id)); // Select all attorneys by default
      this.updateLegalFileParams();
    });
  }

  onAttorneyChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const attorneyId = parseInt(checkbox.value, 10);
    if (checkbox.checked) {
      this.selectedAttorneys.add(attorneyId);
    } else {
      this.selectedAttorneys.delete(attorneyId);
    }
    this.updateLegalFileParams();
    console.log(Array.from(this.selectedAttorneys)); // For debugging purposes
  }

  updateLegalFileParams() {
    this.legalFileService.legalFileParams.update(params => {
      params.attorney = Array.from(this.selectedAttorneys);
      return params;
    });
    console.log(this.legalFileService.legalFileParams); // For debugging purposes
    this.legalFileService.getLegalFiles();
  }

  onSearchTermChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.legalFileService.legalFileParams.update(params => {
      params.searchTerm = input.value;
      return params;
    });
    this.legalFileService.getLegalFiles();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;
    if (pos >= max) {
      this.loadMoreFiles();
    }
  }

  loadMoreFiles() {
    this.legalFileService.legalFileParams.update(params => {
      params.pageNumber += 1;
      return params;
    });
    this.legalFileService.getLegalFiles(true); // Pass true to append items
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.editMode = event;
  }

  cancelEditMode(event: boolean) {
    this.editMode = event;
    this.registerMode = event;
  }
}
