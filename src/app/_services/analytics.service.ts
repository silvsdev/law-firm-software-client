import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Analytics } from '../_models/analytics.model';
import { Metrics } from '../_models/metrics.model';
import { LegalFile } from '../_models/legalFile.model';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { LeadOverviewReportDto } from '../_models/leadOverviewReportDto.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  baseUrl = environment.apiUrl + 'analytics';
  loading = signal<boolean>(false);

  getFileAssignments() {
    this.loading.set(true);
    let params = new HttpParams();
    return this.http.get<Analytics>(this.baseUrl + '/file-assignments', { observe: 'response', params })
      .pipe(
        map(response => response.body),
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load file assignments');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  getMetrics() {
    this.loading.set(true);
    let params = new HttpParams();
    return this.http.get<Metrics>(this.baseUrl + '/metrics', { observe: 'response', params })
      .pipe(
        map(response => response.body),
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load metrics');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  getPrescribingFilesByMonth() {
    this.loading.set(true);
    let params = new HttpParams();
    return this.http.get<Analytics>(this.baseUrl + '/prescribing-files', { observe: 'response', params })
      .pipe(
        map(response => response.body),
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load prescribing files');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  getRecentPerscribingFiles() {
    this.loading.set(true);
    let params = new HttpParams();
    return this.http.get<LegalFile[]>(this.baseUrl + '/recent-prescribing-files', { observe: 'response', params })
      .pipe(
        map(response => response.body),
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load recent prescribing files');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  getLeadOverviewReport(dateRange: string, trendGrouping: string = 'week'): Observable<LeadOverviewReportDto> {
    this.loading.set(true);

    let params = new HttpParams()
      .set('dateRange', dateRange)
      .set('trendGrouping', trendGrouping);

    return this.http.get<LeadOverviewReportDto>(this.baseUrl + '/website-lead-overview-report', { observe: 'response', params })
      .pipe(
        map(response => response.body!),
        catchError(error => {
          console.error('API Error:', error);
          this.notificationService.notifyOnError('Failed to load lead report data');
          return of({
            totalLeads: 0,
            increaseDecreseInTotalLeadsPercentage: 0,
            totalLeadsConverted: 0,
            increaseDecreseInTotalLeadsConvertedPercentage: 0,
            conversionRate: 0,
            increaseDecreseInConversionRatePercentage: 0,
            costPerLead: 0,
            increaseDecreseInCostPerLeadPercentage: 0,
            costPerConversion: 0,
            increaseDecreseInCostPerConversionPercentage: 0,
            totalAdSpend: 0,
            increaseDecreseInTotalAdSpendPercentage: 0,
            totalLeadsInNew: 0,
            totalLeadsInAttorneyReview: 0,
            totalLeadsQualified: 0,
            totalLeadsUnqualified: 0,
            totalLeadsConvertedToSales: 0,
            totalLeadsRequestingEmailContact: 0,
            totalLeadsRequestingPhoneContact: 0,
            totalLeadsRequestingEnglish: 0,
            totalLeadsRequestingZulu: 0,
            totalLeadsRequestingAfrikaans: 0,
            newLeads: 0,
            convertedLeads: 0,
            totalAccidentDatesIn2025: 0,
            totalAccidentDatesIn2024: 0,
            totalAccidentDatesIn2023: 0,
            totalAccidentDatesIn2022: 0,
            totalAccidentDatesIn2021: 0,
            totalAccidentDatesOther: 0
          });

        }),
        finalize(() => this.loading.set(false))
      );
  }

  // private getDummyLeadOverviewData(dateRange: string, trendGrouping: string): LeadOverviewReportDto {
  //   // Update data multipliers based on date range
  //   const multiplier = dateRange === '7days' ? 0.25 :
  //                      dateRange === '30days' ? 1 :
  //                      dateRange === '90days' ? 3 : 4; // for 'year'

  //   // Modify trend data based on trendGrouping
  //   let trendMultiplier = trendGrouping === 'day' ? 0.5 :
  //                          trendGrouping === 'month' ? 1.5 : 1; // for 'week'

  //   return {
  //     // KPIs
  //     totalLeads: Math.round(142 * multiplier),
  //     increaseDecreseInTotalLeadsPercentage: 18,

  //     totalLeadsConverted: Math.round(38 * multiplier),
  //     increaseDecreseInTotalLeadsConvertedPercentage: 12,

  //     conversionRate: 27,
  //     increaseDecreseInConversionRatePercentage: -2,

  //     costPerLead: 45,
  //     increaseDecreseInCostPerLeadPercentage: -8,

  //     costPerConversion: 168,
  //     increaseDecreseInCostPerConversionPercentage: -5,

  //     totalAdSpend: Math.round(6000 * multiplier),
  //     increaseDecreseInTotalAdSpendPercentage: 4,

  //     // Lead Status Distribution
  //     totalLeadsInNew: Math.round(35 * multiplier),
  //     totalLeadsInAttorneyReview: Math.round(42 * multiplier),
  //     totalLeadsQualified: Math.round(28 * multiplier),
  //     totalLeadsUnqualified: Math.round(10 * multiplier),
  //     totalLeadsConvertedToSales: Math.round(22 * multiplier),

  //     // Preferred Contact Method
  //     totalLeadsRequestingEmailContact: Math.round(65 * multiplier),
  //     totalLeadsRequestingPhoneContact: Math.round(72 * multiplier),

  //     // Preferred Language
  //     totalLeadsRequestingEnglish: Math.round(85 * multiplier),
  //     totalLeadsRequestingZulu: Math.round(15 * multiplier),
  //     totalLeadsRequestingAfrikaans: Math.round(25 * multiplier),

  //     // Adjust trend data based on trendGrouping
  //     newLeads: Math.round(30 * multiplier * trendMultiplier),
  //     convertedLeads: Math.round(14 * multiplier * trendMultiplier),


  //     // Accident Date
  //     totalAccidentDatesIn2025: Math.round(5 * multiplier),
  //     totalAccidentDatesIn2024: Math.round(35 * multiplier),
  //     totalAccidentDatesIn2023: Math.round(45 * multiplier),
  //     totalAccidentDatesIn2022: Math.round(30 * multiplier),
  //     totalAccidentDatesIn2021: Math.round(15 * multiplier),
  //     totalAccidentDatesOther: Math.round(12 * multiplier),

  //     // Recent Leads
  //     recentLeads: [
  //       {
  //         id: 1,
  //         name: 'John Smith',
  //         email: 'john.smith@example.com',
  //         phone: '072 123 4567',
  //         preferredContactMethod: 'Phone',
  //         preferredLanguage: 'English',
  //         source: 'Facebook',
  //         createdDate: '2025-04-10T10:30:00',
  //         status: 'New'
  //       },
  //       {
  //         id: 2,
  //         name: 'Sarah Davis',
  //         email: 'sarah.d@example.com',
  //         phone: '082 345 6789',
  //         preferredContactMethod: 'Email',
  //         preferredLanguage: 'English',
  //         source: 'Google Ads',
  //         createdDate: '2025-04-08T14:15:00',
  //         status: 'Attorney Review'
  //       },
  //       {
  //         id: 3,
  //         name: 'Robert Johnson',
  //         email: 'robert.j@example.com',
  //         phone: '071 456 7890',
  //         preferredContactMethod: 'Phone',
  //         preferredLanguage: 'Afrikaans',
  //         source: 'Discovery',
  //         createdDate: '2025-04-05T09:45:00',
  //         status: 'Qualified'
  //       },
  //       {
  //         id: 4,
  //         name: 'Mary Williams',
  //         email: 'mary.w@example.com',
  //         phone: '083 567 8901',
  //         preferredContactMethod: 'Email',
  //         preferredLanguage: 'Zulu',
  //         source: 'Referral',
  //         createdDate: '2025-04-02T11:20:00',
  //         status: 'Converted'
  //       },
  //       {
  //         id: 5,
  //         name: 'James Brown',
  //         email: 'james.b@example.com',
  //         phone: '074 678 9012',
  //         preferredContactMethod: 'Phone',
  //         preferredLanguage: 'English',
  //         source: 'Website',
  //         createdDate: '2025-03-28T16:30:00',
  //         status: 'Unqualified'
  //       }
  //     ]
  //   };
  // }
}
