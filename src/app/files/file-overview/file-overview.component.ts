import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideOverComponent } from '../../_shared/slide-over/slide-over.component';
import { FileCreateComponent } from '../file-create/file-create.component';
import { FileUpdateComponent } from '../file-update/file-update.component';
import { CheckboxInputComponent } from '../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { LegalFileService } from '../../_services/legal-file.service';
import { UserService } from '../../_services/user.service';
import { LegalFile } from '../../_models/legalFile.model';
import { Attorney } from '../../_models/attorney.model';

@Component({
  selector: 'app-file-overview',
  standalone: true,
  imports: [
    CommonModule,
    SlideOverComponent,
    FileCreateComponent,
    FileUpdateComponent,
    CheckboxInputComponent,
    DropdownInputComponent
  ],
  templateUrl: './file-overview.component.html',
  styleUrl: './file-overview.component.css'
})
export class FileOverviewComponent implements OnInit {
  // Services
  public legalFileService = inject(LegalFileService);
  public userService = inject(UserService);

  // UI state
  registerMode = false;
  editMode = false;
  panelTitle = 'Add new file';

  // Dropdown states
  dropdownOpen = false;
  openDropdownId: string | null = null;

  // Data
  attorneys: Attorney[] = [];
  selectedAttorneys: Set<number> = new Set();
  selectedFile!: LegalFile;

  ngOnInit(): void {
    this.getAttorneys();
    this.loadLegalFiles();

    // Add a click handler to close dropdowns when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  // Handler for clicks outside any dropdown
  private handleOutsideClick(event: MouseEvent): void {
    // Close both the attorney filter dropdown and the action menu
    this.dropdownOpen = false;
    this.openDropdownId = null;
  }

  // Document click handler (use this instead of the private method for specific elements)
  @HostListener('document:click')
  closeAllDropdowns() {
    this.dropdownOpen = false;
    this.openDropdownId = null;
  }

  // Action menu toggle (per row)
  toggleActionMenu(fileId: string, event: Event) {
    // Prevent click from propagating to document click handler
    event.stopPropagation();

    // If already open, close it, otherwise open this one
    this.openDropdownId = this.openDropdownId === fileId ? null : fileId;
  }

  // Attorney filter dropdown toggle
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Data loading methods
  loadLegalFiles() {
    this.legalFileService.getLegalFiles();
  }

  getAttorneys() {
    this.userService.getAttorneys().subscribe((attorneys: Attorney[]) => {
      this.attorneys = attorneys;
      this.selectedAttorneys = new Set(attorneys.map(attorney => attorney.id)); // Select all attorneys by default
      this.updateLegalFileParams();
    });
  }

  loadMoreFiles() {
    this.legalFileService.legalFileParams.update(params => {
      params.pageNumber += 1;
      return params;
    });
    this.legalFileService.getLegalFiles(true); // Pass true to append items
  }

  // Filter/search methods
  onAttorneyChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const attorneyId = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.selectedAttorneys.add(attorneyId);
    } else {
      this.selectedAttorneys.delete(attorneyId);
    }

    event.stopPropagation(); // Prevent closing the dropdown
    this.updateLegalFileParams();
  }

  updateLegalFileParams() {
    this.legalFileService.legalFileParams.update(params => {
      params.attorney = Array.from(this.selectedAttorneys);
      return params;
    });
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

  // UI action methods
  addFile() {
    this.panelTitle = 'Add new file';
    this.editMode = false;
    this.registerMode = true;
  }

  updateLegalFile(file: LegalFile) {
    this.selectedFile = file;
    this.panelTitle = 'Edit file';
    this.registerMode = false;
    this.editMode = true;
    this.openDropdownId = null; // Close the dropdown after selecting edit
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.editMode = event;
  }

  cancelEditMode(event: boolean) {
    this.editMode = event;
    this.registerMode = event;
  }

  // Scroll event for infinite loading
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;

    if (pos >= max) {
      this.loadMoreFiles();
    }
  }
}
