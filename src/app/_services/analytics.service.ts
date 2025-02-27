import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Analytics } from '../_models/analytics.model';
import { Metrics } from '../_models/metrics.model';
import { LegalFile } from '../_models/legalFile.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);

  baseUrl = environment.apiUrl + 'analytics';

  getFileAssignments() {
    let params = new HttpParams();
    return this.http.get<Analytics>(this.baseUrl + '/file-assignments', { observe: 'response', params })
  }

  getMetrics() {
    let params = new HttpParams();
    return this.http.get<Metrics>(this.baseUrl + '/metrics', { observe: 'response', params })
  }

  getPrescribingFilesByMonth() {
    let params = new HttpParams();
    return this.http.get<Analytics>(this.baseUrl + '/prescribing-files', { observe: 'response', params })
  }

  getRecentPerscribingFiles() {
    let params = new HttpParams();
    return this.http.get<LegalFile[]>(this.baseUrl + '/recent-prescribing-files', { observe: 'response', params })
  }


}
