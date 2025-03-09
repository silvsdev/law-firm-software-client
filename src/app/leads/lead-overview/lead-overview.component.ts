import { Component, computed, inject } from '@angular/core';
import { LeadService } from '../../_services/lead.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Lead } from '../../_models/lead.model';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-lead-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './lead-overview.component.html',
  styleUrl: './lead-overview.component.css'
})
export class LeadOverviewComponent {
  leads = computed(() => this.leadService.Leads() || []);
  statuses: string[] = ['New', 'Attorney Review', 'Qualified', 'Unqualified', 'Converted'];
  showModal = false;
  selectedLead: Lead | null = null;

  constructor(private leadService: LeadService) {}

  ngOnInit(): void {
    this.leadService.getLeads();
  }

  trackByLeadId(index: number, lead: Lead): number {
    return lead.id;
  }

  onStatusChange(lead: Lead, newStatus: string): void {
    lead.status = newStatus;

    this.leadService.updateLead(lead);
    if (newStatus === 'Attorney Review') {
      this.selectedLead = lead;
      this.showModal = true;
    }
  }

  generatePDF(lead: Lead): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineWidth = pageWidth - 2 * margin;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Lead Details', margin, 10);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name:`, margin, 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.name}`, 50, 20);

    doc.setFont('helvetica', 'bold');
    doc.text(`Email:`, margin, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.email}`, 50, 30);

    doc.setFont('helvetica', 'bold');
    doc.text(`Phone:`, margin, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.phone}`, 50, 40);

    doc.setFont('helvetica', 'bold');
    doc.text(`Preferred Contact Method:`, margin, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.preferredContactMethod}`, 80, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`Accident Date:`, margin, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.accidentDate}`, 50, 60);

    doc.setFont('helvetica', 'bold');
    doc.text(`Source:`, margin, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.source}`, 50, 70);

    doc.setFont('helvetica', 'bold');
    doc.text(`Status:`, margin, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.status}`, 50, 80);

    doc.setFont('helvetica', 'bold');
    doc.text(`Created Date:`, margin, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(lead.createdDate).toLocaleDateString('en-GB')}`, 50, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, 100);
    doc.setFont('helvetica', 'normal');
    doc.line(margin, 110, margin + lineWidth, 110);
    doc.line(margin, 120, margin + lineWidth, 120);
    doc.line(margin, 130, margin + lineWidth, 130);
    doc.line(margin, 140, margin + lineWidth, 140);
    doc.line(margin, 150, margin + lineWidth, 150);
    doc.line(margin, 160, margin + lineWidth, 160);
    doc.line(margin, 170, margin + lineWidth, 170);
    doc.line(margin, 180, margin + lineWidth, 180);
    doc.line(margin, 190, margin + lineWidth, 190);

    const formattedDate = new Date(lead.createdDate).toLocaleDateString('en-GB').replace(/\//g, '-');
    doc.save(`${lead.name}-${formattedDate}.pdf`);
}

  closeModal(): void {
    this.showModal = false;
  }

  confirmPrint(): void {
    if (this.selectedLead) {
      this.generatePDF(this.selectedLead);
    }
    this.closeModal();
  }

  onUpdateLead(lead: Lead): void {
    this.leadService.updateLead(lead);
  }

}
