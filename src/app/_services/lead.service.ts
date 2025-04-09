import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../_models/lead.model';
import { LeadAdd } from '../_models/LeadAdd.model';
import { NotificationService } from './notification.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  baseUrl = environment.apiUrl + 'lead';
  Leads = signal<Lead[] | null>(null);
  loading = signal<boolean>(false);

  getLeads() {
    this.loading.set(true);
    return this.http.get<Lead[]>(this.baseUrl)
      .pipe(
        finalize(() => this.loading.set(false)) 
      )
      .subscribe({
        next: response => {
          this.Leads.set(response);
        },
        error: error => {
          this.notificationService.notifyOnError('Failed to load leads');
        }
      });
  }

  updateLead(lead: Lead) {
    this.loading.set(true);
    return this.http.put<Lead>(this.baseUrl, lead)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: updatedLead => {
          // Option 1: Optimistic local update (faster UI response)
          const leads = this.Leads();
          if (leads) {
            const index = leads.findIndex(l => l.id === updatedLead.id);
            if (index !== -1) {
              leads[index] = updatedLead;
              this.Leads.set([...leads]);
            }
          }

          // Option 2: Refresh from server to ensure data consistency
          this.getLeads();

          this.notificationService.notifyOnSuccess('Lead updated successfully');
        },
        error: error => {
          this.notificationService.notifyOnError('Failed to update lead');
        }
      });
  }

  addLead(lead: LeadAdd) {
    this.loading.set(true);
    return this.http.post<Lead>(`${this.baseUrl}/add-lead`, lead)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: newLead => {
          // Refresh the leads from the server after adding
          this.getLeads();
          this.notificationService.notifyOnSuccess('Lead added successfully');
        },
        error: error => {
          this.notificationService.notifyOnError('Failed to add lead');
        }
      });
  }

  deleteLead(id: number) {
    this.loading.set(true);
    return this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          // Option 1: Optimistic local update (faster UI response)
          const leads = this.Leads();
          if (leads) {
            this.Leads.set(leads.filter(lead => lead.id !== id));
          }

          // Option 2: Refresh from server to ensure data consistency
          this.getLeads();

          this.notificationService.notifyOnSuccess('Lead deleted successfully');
        },
        error: error => {
          this.notificationService.notifyOnError('Failed to delete lead');
        }
      });
  }
}
