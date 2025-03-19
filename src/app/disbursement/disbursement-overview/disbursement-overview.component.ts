import { Component, OnInit } from '@angular/core';
import { LegalFileForDisbursement } from '../../_models/legalFileForDisbursement.model';
import { LegalFileService } from '../../_services/legal-file.service';
import { PaginatedResult } from '../../_models/pagination';
import { DisbursementAddComponent } from "../disbursement-add/disbursement-add.component";
import { SlideOverComponent } from "../../_shared/slide-over/slide-over.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disbursement-overview',
  standalone: true,
  imports: [DisbursementAddComponent, SlideOverComponent, CommonModule],
  templateUrl: './disbursement-overview.component.html',
  styleUrl: './disbursement-overview.component.css'
})
export class DisbursementOverviewComponent implements OnInit {
  legalFilesForDisbursements: LegalFileForDisbursement[] = [];
  paginatedResult: PaginatedResult<LegalFileForDisbursement[]> | null = null;
  registerMode = false;
  editMode = false;
  panelTitle = 'Add new file';
  selectedFile!: number;

  constructor(public legalFileService: LegalFileService) {}

  ngOnInit(): void {
    this.loadLegalFilesForDisbursements();
  }

  loadLegalFilesForDisbursements() {
    this.legalFileService.getLegalFilesForDisbursements();
  }

  addDisbursement(file: number) {
    this.selectedFile = file;
    this.panelTitle = 'Add a new disbursement';
    this.editMode = false;
    this.registerMode = true;
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
