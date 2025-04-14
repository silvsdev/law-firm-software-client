import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-overview',
  standalone: true,
  imports: [
    CommonModule,
    SlideOverComponent,
    FileCreateComponent,
    FileUpdateComponent,
  ],
  templateUrl: './file-overview.component.html',
  styleUrl: './file-overview.component.css'
})
export class FileOverviewComponent implements OnInit, OnDestroy {
  // Services
  public legalFileService = inject(LegalFileService);
  public userService = inject(UserService);
  public router = inject(Router);

  // Add this property to the FileOverviewComponent class
  private isLoadingMore = false;
  private observer: IntersectionObserver | null = null;
  // Add this property to the FileOverviewComponent class
private searchDebounceTimeout: any = null;

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

    // Set up intersection observer for infinite scrolling
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    // Clean up the observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Remove document event listener
    document.removeEventListener('click', this.handleOutsideClick.bind(this));

    // Remove sentinel element if it exists
    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      sentinel.remove();
    }

    // Clear any pending search debounce
    if (this.searchDebounceTimeout) {
      clearTimeout(this.searchDebounceTimeout);
    }
  }

  // Set up infinite scroll with Intersection Observer
  private setupInfiniteScroll(): void {
    // Create a sentinel element that we'll observe
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '10px';
    sentinel.style.width = '100%';

    // Add it to the DOM - find the table container and append after it
    setTimeout(() => {
      const tableContainer = document.querySelector('.inline-block.min-w-full');
      if (tableContainer && tableContainer.parentNode) {
        tableContainer.parentNode.appendChild(sentinel);

        // Create and setup the observer
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.isLoadingMore) {
              this.isLoadingMore = true;

              setTimeout(() => {
                this.loadMoreFiles();
                setTimeout(() => {
                  this.isLoadingMore = false;
                }, 500);
              }, 100);
            }
          });
        }, {
          root: null, // viewport
          rootMargin: '0px 0px 100px 0px', // 100px bottom margin
          threshold: 0.1 // trigger when 10% visible
        });

        // Start observing
        this.observer.observe(sentinel);
      } else {
        console.error('Could not find table container to append sentinel');
      }
    }, 500); // Give the DOM time to render
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

  // Modify the onSearchTermChange method to handle typing and backspacing better
onSearchTermChange(event: Event) {
  const input = event.target as HTMLInputElement;

  // Reset the page number to 1 whenever the search term changes
  this.legalFileService.legalFileParams.update(params => {
    params.searchTerm = input.value;
    params.pageNumber = 1; // Reset to first page on new search
    return params;
  });

  // Debounce the search to prevent too many API calls while typing
  if (this.searchDebounceTimeout) {
    clearTimeout(this.searchDebounceTimeout);
  }

  this.searchDebounceTimeout = setTimeout(() => {
    this.legalFileService.getLegalFiles();
  }, 300); // Wait 300ms after typing stops before searching
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

  viewFile(file: LegalFile) {
    this.selectedFile = file;
    this.router.navigate(['/legal-file-view-example']);
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
