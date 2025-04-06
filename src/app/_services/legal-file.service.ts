import { inject, Injectable, model, signal } from '@angular/core';
import { LegalFile } from '../_models/legalFile.model';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LegalFileAdd } from '../_models/legalFileAdd.model';
import { AccountService } from './account.service';
import { PaginatedResult } from '../_models/pagination';
import { LegalFileParams } from '../_models/legalFileParams.model';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { LegalFileUpdate } from '../_models/legalFileUpdate.model';
import { NotificationService } from './notification.service';
import { LegalFileForDisbursement } from '../_models/legalFileForDisbursement.model';

@Injectable({
  providedIn: 'root'
})
export class LegalFileService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  private accountService = new AccountService();
  baseUrl = environment.apiUrl + 'legalFile';
  user = this.accountService.currentUser();
  paginatedResult = signal<PaginatedResult<LegalFile[]> | null>(null);
  paginatedResultForDisbursements = signal<PaginatedResult<LegalFileForDisbursement[]> | null>(null);
  legalFileCache = new Map();
  legalFileParams =  signal<LegalFileParams>(new LegalFileParams());

  resetLegalFileParams() {
    this.legalFileParams.set(new LegalFileParams());
  }

  getLegalFiles(append: boolean = false) {
    const response = this.legalFileCache.get(Object.values(this.legalFileParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.legalFileParams().pageNumber, this.legalFileParams().pageSize);

    params = params.append('fileReference', this.legalFileParams().fileReference);
    params = params.append('dateOfAccident', this.legalFileParams().dateOfAccident);
    params = params.append('dateOfInstruction', this.legalFileParams().dateOfInstruction);
    params = params.append('status', this.legalFileParams().status);
    params = params.append('prescriptionDate', this.legalFileParams().prescriptionDate);
    params = params.append('searchTerm', this.legalFileParams().searchTerm);

    // Append attorneys array as individual query parameters
    this.legalFileParams().attorney.forEach(attorneyId => {
      params = params.append('attorneys', attorneyId.toString());
    });

    return this.http.get<LegalFile[]>(this.baseUrl, { observe: 'response', params }).subscribe({
      next: response => {
        if (append && this.paginatedResult()?.items) {
          const currentItems = this.paginatedResult()?.items || [];
          const newItems = response.body || [];
          this.paginatedResult.set({
            ...this.paginatedResult(),
            items: [...currentItems, ...newItems]
          });
        } else {
          setPaginatedResponse(response, this.paginatedResult);
        }
        this.legalFileCache.set(Object.values(this.legalFileParams()).join('-'), response);
      }
    });
  }

 

  getLegalFilesForDisbursements() {
    const response = this.legalFileCache.get(Object.values(this.legalFileParams()).join('-') + '-get-legal-files-for-disbursements');

    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.legalFileParams().pageNumber, this.legalFileParams().pageSize);

    params = params.append('minAge', this.legalFileParams().fileReference);
    if (this.legalFileParams().attorney.length > 0) {
      params = params.append('attorney', this.legalFileParams().attorney.join(','));
    }
    params = params.append('dateOfAccident', this.legalFileParams().dateOfAccident);
    params = params.append('dateOfInstruction', this.legalFileParams().dateOfInstruction);
    params = params.append('status', this.legalFileParams().status);
    params = params.append('prescriptionDate', this.legalFileParams().prescriptionDate);

    return this.http.get<LegalFileForDisbursement[]>(`${this.baseUrl}/get-legal-files-for-disbursements`, { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResultForDisbursements);
        this.legalFileCache.set(Object.values(this.legalFileParams()).join('-') + '-get-legal-files-for-disbursements', response);
      }
    });
  }

  addLegalFile(legalFile: LegalFileAdd) {
    return this.http.post<LegalFile>(this.baseUrl, legalFile).subscribe({
      next: () => {
        this.legalFileCache.clear();
        this.getLegalFiles();
        this.notificationService.notifyOnSuccess(
          'File created successfully'
        );
      }
    });
  }

  updateLegalFile(legalFile: LegalFileUpdate) {
    return this.http.put(this.baseUrl, legalFile).subscribe({
      next: () => {
        this.legalFileCache.clear();
        this.notificationService.notifyOnSuccess(
          'File updated successfully'
        );
        this.getLegalFiles();
      }
    });
  }

  deleteLegalFile(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).subscribe({
      next: () => {
        this.legalFileCache.clear();
        this.getLegalFiles();
        this.notificationService.notifyOnSuccess(
          'File deleted successfully'
        );
      }
    });
  }

}
