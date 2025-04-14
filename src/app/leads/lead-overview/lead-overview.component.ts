import { Component, computed, inject } from '@angular/core';
import { LeadService } from '../../_services/lead.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Lead } from '../../_models/lead.model';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { LeadCreateComponent } from "../lead-create/lead-create.component";
import { SlideOverComponent } from "../../_shared/slide-over/slide-over.component";
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-lead-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, LeadCreateComponent, SlideOverComponent],
  templateUrl: './lead-overview.component.html',
  styleUrl: './lead-overview.component.css'
})
export class LeadOverviewComponent {
  router = inject(Router);
  leadService = inject(LeadService);
  statuses: string[] = ['New', 'Attorney Review', 'Qualified', 'Unqualified', 'Converted'];
  showModal = false;
  selectedLead: Lead | null = null;
  registerMode = false;
  editMode = false;
  panelTitle = 'Add new user';
  isDropdownOpen = false;

  ngOnInit(): void {
    this.leadService.getLeads();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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
    doc.text(`${lead.source}`+' Lead', margin, 10);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name:`, margin, 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.name}`, 80, 20);

    doc.setFont('helvetica', 'bold');
    doc.text(`Email:`, margin, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.email}`, 80, 30);

    doc.setFont('helvetica', 'bold');
    doc.text(`Phone:`, margin, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.phone}`, 80, 40);

    doc.setFont('helvetica', 'bold');
    doc.text(`Preferred Contact Method:`, margin, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.preferredContactMethod}`, 80, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`Preferred Language:`, margin, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.preferredLanguage}`, 80, 60);

    doc.setFont('helvetica', 'bold');
    doc.text(`Accident Date:`, margin, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.accidentDate}`, 80, 70);

    doc.setFont('helvetica', 'bold');
    doc.text(`Source:`, margin, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.source}`, 80, 80);

    doc.setFont('helvetica', 'bold');
    doc.text(`Status:`, margin, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`${lead.status}`, 80, 90);

    doc.setFont('helvetica', 'bold');
    doc.text(`Date Submitted:`, margin, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(lead.createdDate).toLocaleDateString('en-GB')}`, 80, 100);

    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, 110);
    doc.setFont('helvetica', 'normal');
    doc.line(margin, 120, margin + lineWidth, 120);
    doc.line(margin, 130, margin + lineWidth, 130);
    doc.line(margin, 140, margin + lineWidth, 140);
    doc.line(margin, 150, margin + lineWidth, 150);
    doc.line(margin, 160, margin + lineWidth, 160);
    doc.line(margin, 170, margin + lineWidth, 170);
    doc.line(margin, 180, margin + lineWidth, 180);
    doc.line(margin, 190, margin + lineWidth, 190);
    doc.line(margin, 200, margin + lineWidth, 200);

    const formattedDate = new Date(lead.createdDate).toLocaleDateString('en-GB').replace(/\//g, '-');
    doc.save(`${lead.name}-${formattedDate}.pdf`);
}

//   generateDiscoveryPDF(lead: Lead): void {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 10;
//     const lineWidth = pageWidth - 2 * margin;
//     let yPos = 10;
//     const lineHeight = 8;

//     // Main Heading
//     doc.setFontSize(20);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Discovery Lead', pageWidth / 2, yPos, { align: 'center' });
//     yPos += lineHeight * 2;

//     // Lead Details Section
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Lead Details', margin, yPos);
//     yPos += lineHeight;

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Date sent:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(new Date(lead.createdDate).toLocaleDateString('en-GB'), margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Lead ID:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.id.toString(), margin + 50, yPos);
//     yPos += lineHeight * 2;

//     // Injured Member Details Section
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Injured Member Details', margin, yPos);
//     yPos += lineHeight;

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Injured Member:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.injuredMemberName || lead.name, margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Member Number:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.memberNumber || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Home Telephone:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.homeTelephone || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Work Telephone:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.workTelephone || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Cell Phone Number:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.cellPhoneNumber || lead.phone, margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Email Address:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.emailAddress || lead.email, margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('I.D Number:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.idNumberInjured || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Residential Address:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.residentialAddress || 'N/A', margin + 50, yPos);
//     yPos += lineHeight * 2;

//     // Principle Member Details Section
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Principle Member Details', margin, yPos);
//     yPos += lineHeight;

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Name and Surname:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.principleName || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Home Telephone:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.principleHomeTel || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Work Telephone:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.principleWorkTel || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Cell Phone:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.principleCellTel || 'N/A', margin + 50, yPos);
//     yPos += lineHeight * 2;

//     // Only include spouse section if spouse is "Yes"

//       doc.setFontSize(16);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Spouse', margin, yPos);
//       yPos += lineHeight;

//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Name:', margin, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(lead.spouseName || 'N/A', margin + 50, yPos);
//       yPos += lineHeight;

//       doc.setFont('helvetica', 'bold');
//       doc.text('Contact Number:', margin, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(lead.spouseContactNumber || 'N/A', margin + 50, yPos);
//       yPos += lineHeight * 2;


//     // Accident Details Section
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Accident Details', margin, yPos);
//     yPos += lineHeight;

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Nature of Injury:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.natureOfInjury || 'N/A', margin + 50, yPos);
//     yPos += lineHeight;

//     doc.setFont('helvetica', 'bold');
//     doc.text('Description of Accident:', margin, yPos);
//     yPos += lineHeight;
//     doc.setFont('helvetica', 'normal');

//     // Handle multiline text for description
//     if (lead.accidentDescription) {
//       const splitText = doc.splitTextToSize(lead.accidentDescription, pageWidth - (margin * 2) - 10);
//       doc.text(splitText, margin + 5, yPos);
//       yPos += (splitText.length * 6) + lineHeight;
//     } else {
//       yPos += lineHeight;
//     }

//     doc.setFont('helvetica', 'bold');
//     doc.text('Date of Accident:', margin, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(lead.accidentDate || 'N/A', margin + 50, yPos);
//     yPos += lineHeight * 2;

//     // Attorney Notes Section
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Attorney Notes', margin, yPos);
//     yPos += lineHeight;

//     // Draw lines for attorney notes (same as in your original function)
//     for (let i = 0; i < 9; i++) {
//       doc.line(margin, yPos + (i * 10), margin + lineWidth, yPos + (i * 10));
//     }

//     const formattedDate = new Date(lead.createdDate).toLocaleDateString('en-GB').replace(/\//g, '-');
//     doc.save(`Discovery-Lead-${lead.name}-${formattedDate}.pdf`);
//  }
generateDiscoveryPDF(lead: Lead): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const lineWidth = pageWidth - 2 * margin;
  let yPos = 10;
  const lineHeight = 7;
  const columnWidth = (pageWidth - (2 * margin)) / 3;

  // Main Heading
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Discovery Lead', pageWidth / 2, yPos, { align: 'center' });
  yPos += lineHeight * 2;

  // Lead Details Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Lead Details', margin, yPos);
  yPos += lineHeight;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Date sent:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(lead.createdDate).toLocaleDateString('en-GB'), margin + 50, yPos);
  yPos += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Lead ID:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.id.toString(), margin + 50, yPos);
  yPos += lineHeight * 2;

  // Injured Member Details Section - 3 column layout with values below titles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Injured Member Details', margin, yPos);
  yPos += lineHeight * 1.5;

  // First row of 3 columns
  doc.setFontSize(11);
  const col1X = margin;
  const col2X = margin + columnWidth;
  const col3X = margin + (columnWidth * 2);

  // Column 1 - Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Injured Member', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.injuredMemberName || lead.name, col1X, yPos);

  // Column 2 - Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Member Number', col2X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.memberNumber || 'N/A', col2X, yPos);

  // Column 3 - Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('I.D Number', col3X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.idNumberInjured || 'N/A', col3X, yPos);

  yPos += lineHeight * 1.5;

  // Second row of 3 columns
  // Column 1 - Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Home Telephone', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.homeTelephone || 'N/A', col1X, yPos);

  // Column 2 - Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Work Telephone', col2X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.workTelephone || 'N/A', col2X, yPos);

  // Column 3 - Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Cell Phone Number', col3X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.cellPhoneNumber || lead.phone, col3X, yPos);

  yPos += lineHeight * 1.5;

  // Email in its own row spanning 2 columns
  doc.setFont('helvetica', 'bold');
  doc.text('Email Address', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.emailAddress || lead.email, col1X, yPos);

  // Put Residential Address in Column 3
  doc.setFont('helvetica', 'bold');
  doc.text('Residential Address', col3X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');

  // Handle multiline address if needed
  if (lead.residentialAddress) {
    const splitAddress = doc.splitTextToSize(lead.residentialAddress, columnWidth - 5);
    doc.text(splitAddress, col3X, yPos);
    yPos += (splitAddress.length * 5); // Adjust for address height
  } else {
    doc.text('N/A', col3X, yPos);
    yPos += lineHeight;
  }

  yPos += lineHeight;

  // Principle Member Details Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Principle Member Details', margin, yPos);
  yPos += lineHeight * 1.5;

  // Column 1 - Row 1
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Name and Surname', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.principleName || 'N/A', col1X, yPos);

  // Column 2 - Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Home Telephone', col2X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.principleHomeTel || 'N/A', col2X, yPos);

  // Column 3 - Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Work Telephone', col3X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.principleWorkTel || 'N/A', col3X, yPos);

  yPos += lineHeight * 1.5;

  // Cell Phone on its own row
  doc.setFont('helvetica', 'bold');
  doc.text('Cell Phone', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.principleCellTel || 'N/A', col1X, yPos);

  yPos += lineHeight * 1.5;

  // Spouse Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Spouse', margin, yPos);
  yPos += lineHeight * 1.5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Name', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.spouseName || 'N/A', col1X, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact Number', col2X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.spouseContactNumber || 'N/A', col2X, yPos);

  yPos += lineHeight * 1.5;

  // Accident Details Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Accident Details', margin, yPos);
  yPos += lineHeight * 1.5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Nature of Injury', col1X, yPos);
  yPos += lineHeight - 2;
  doc.setFont('helvetica', 'normal');
  doc.text(lead.natureOfInjury || 'N/A', col1X, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Date of Accident', col3X, yPos - lineHeight + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(lead.accidentDate || 'N/A', col3X, yPos);

  yPos += lineHeight * 1.5;

  doc.setFont('helvetica', 'bold');
  doc.text('Description of Accident', col1X, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');

  // Handle multiline text for description
  if (lead.accidentDescription) {
    const splitText = doc.splitTextToSize(lead.accidentDescription, pageWidth - (margin * 2) - 10);
    doc.text(splitText, margin + 5, yPos);
    yPos += (splitText.length * 5) + lineHeight;
  } else {
    doc.text('N/A', margin + 5, yPos);
    yPos += lineHeight;
  }

  yPos += lineHeight;

  // Attorney Notes Section - Expanded to use remaining space
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Attorney Notes', margin, yPos);
  yPos += lineHeight;

  // Calculate how many lines we can fit (up to page bottom with margin)
  const pageBottom = doc.internal.pageSize.getHeight() - margin;
  const linesAvailable = Math.floor((pageBottom - yPos) / 10);

  // Draw lines for attorney notes - more lines to fill remaining space
  for (let i = 0; i < linesAvailable; i++) {
    doc.line(margin, yPos + (i * 10), margin + lineWidth, yPos + (i * 10));
  }

  const formattedDate = new Date(lead.createdDate).toLocaleDateString('en-GB').replace(/\//g, '-');
  doc.save(`Discovery-Lead-${lead.name}-${formattedDate}.pdf`);
}
  closeModal(): void {
    this.showModal = false;
  }

  confirmPrint(): void {
    if (this.selectedLead) {
      if (this.selectedLead.source === 'Discovery') {
        this.generateDiscoveryPDF(this.selectedLead);
      } else {
        this.generatePDF(this.selectedLead);
      }
    }
    this.closeModal();
  }

  onUpdateLead(lead: Lead): void {
    this.leadService.updateLead(lead);
  }

  addLead(){
    this.panelTitle = 'Add new lead';
    this.editMode = false;
    this.registerMode = true;
  }

  addDiscoveryLead(){
    this.router.navigate(["/discovery-lead"]);

  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.editMode = event;
  }

}


