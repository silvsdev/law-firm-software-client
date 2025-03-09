import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../_models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);

  baseUrl = environment.apiUrl + 'lead';
  Leads = signal<Lead[] | null>(null);

  getLeads() {
    return this.http.get<Lead[]>(this.baseUrl).subscribe({
      next: response => {
        this.Leads.set(response);
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
          }
        }
      }
    });
  }
}
