import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../_models/lead.model';
import { LeadAdd } from '../_models/LeadAdd.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  baseUrl = environment.apiUrl + 'lead';
  Leads = signal<Lead[] | null>(null);

  getLeads() {
    return this.http.get<Lead[]>(this.baseUrl).subscribe({
      next: response => {
        this.Leads.set(response);
      },
      error: error => {
        this.notificationService.notifyOnError('Failed to load leads');
      }
    });
  }

  updateLead(lead: Lead) {
    return this.http.put<Lead>(this.baseUrl, lead).subscribe({
      next: updatedLead => {
        const leads = this.Leads();
        if (leads) {
          const index = leads.findIndex(l => l.id === updatedLead.id);
          if (index !== -1) {
            leads[index] = updatedLead;
            this.Leads.set([...leads]);
            this.notificationService.notifyOnSuccess('Lead updated successfully');
          }
        }
      },
      error: error => {
        this.notificationService.notifyOnError('Failed to update lead');
      }
    });
  }

  addLead(lead: LeadAdd) {
    return this.http.post<Lead>(`${this.baseUrl}/add-lead`, lead).subscribe({
      next: newLead => {
        const leads = this.Leads();
        if (leads) {
          this.Leads.set([...leads, newLead]);
          this.notificationService.notifyOnSuccess('Lead added successfully');
        }
      },
      error: error => {
        this.notificationService.notifyOnError('Failed to add lead');
      }
    });
  }

  deleteLead(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).subscribe({
      next: () => {
        const leads = this.Leads();
        if (leads) {
          this.Leads.set(leads.filter(lead => lead.id !== id));
          this.notificationService.notifyOnSuccess('Lead deleted successfully');
        }
      },
      error: error => {
        this.notificationService.notifyOnError('Failed to delete lead');
      }
    });
  }
}
