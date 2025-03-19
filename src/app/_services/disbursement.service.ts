import { inject, Injectable } from '@angular/core';
import { Disbursement } from '../_models/disbursement.model';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {
  private http = inject(HttpClient);

    baseUrl = environment.apiUrl + 'disbursement';

  constructor() { }

  addDisbursement(disbursement: Disbursement) {
    return this.http.post<Disbursement>(this.baseUrl, disbursement).subscribe({
      next: newDisbursement => {
        console.log(newDisbursement);
      }
    });
  }
}
