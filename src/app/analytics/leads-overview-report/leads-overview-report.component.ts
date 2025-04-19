import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { AnalyticsService } from '../../_services/analytics.service';
import { LeadOverviewReportDto } from '../../_models/leadOverviewReportDto.model';

@Component({
  selector: 'app-leads-overview-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads-overview-report.component.html',
  styleUrls: ['./leads-overview-report.component.css']
})
export class LeadOverviewReportComponent implements OnInit {
  selectedDateRange = '30days';
  selectedTrendGrouping = 'week';
  reportData: LeadOverviewReportDto = {} as LeadOverviewReportDto;
  Math = Math; // Make Math available in the template

  // Charts
  leadStatusChart: any;
  contactMethodChart: any;
  languageChart: any;
  leadTrendChart: any;
  accidentYearChart: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  onDateRangeChange(): void {
    this.loadReportData();
  }

  onTrendGroupingChange(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.analyticsService.getLeadOverviewReport(this.selectedDateRange, this.selectedTrendGrouping).subscribe({
      next: (data) => {
        this.reportData = data;
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Error loading lead report data', error);
      }
    });
  }

  initializeCharts(): void {
    this.initializeLeadStatusChart();
    this.initializeContactMethodChart();
    this.initializeLanguageChart();
    this.initializeLeadTrendChart();
    this.initializeAccidentYearChart();
  }

  initializeLeadStatusChart(): void {
    // Destroy existing chart if it exists
    if (this.leadStatusChart) {
      this.leadStatusChart.destroy();
    }

    const ctx = document.getElementById('leadStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.leadStatusChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['New', 'Attorney Review', 'Qualified', 'Unqualified', 'Converted'],
        datasets: [{
          label: 'Number of Leads',
          data: [
            this.reportData.totalLeadsInNew,
            this.reportData.totalLeadsInAttorneyReview,
            this.reportData.totalLeadsQualified,
            this.reportData.totalLeadsUnqualified,
            this.reportData.totalLeadsConvertedToSales
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // New - Blue
            'rgba(245, 158, 11, 0.7)',  // Attorney Review - Amber
            'rgba(139, 92, 246, 0.7)',  // Qualified - Purple
            'rgba(239, 68, 68, 0.7)',   // Unqualified - Red
            'rgba(16, 185, 129, 0.7)'   // Converted - Green
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  initializeContactMethodChart(): void {
    // Destroy existing chart if it exists
    if (this.contactMethodChart) {
      this.contactMethodChart.destroy();
    }

    const ctx = document.getElementById('contactMethodChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.contactMethodChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Email', 'Phone'],
        datasets: [{
          data: [
            this.reportData.totalLeadsRequestingEmailContact,
            this.reportData.totalLeadsRequestingPhoneContact
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Email - Blue
            'rgba(16, 185, 129, 0.7)'   // Phone - Green
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((context.raw as number) / total * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  initializeLanguageChart(): void {
    // Destroy existing chart if it exists
    if (this.languageChart) {
      this.languageChart.destroy();
    }

    const ctx = document.getElementById('languageChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.languageChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['English', 'Afrikaans', 'Zulu'],
        datasets: [{
          label: 'Preferred Language',
          data: [
            this.reportData.totalLeadsRequestingEnglish,
            this.reportData.totalLeadsRequestingAfrikaans,
            this.reportData.totalLeadsRequestingZulu
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // English - Blue
            'rgba(16, 185, 129, 0.7)',  // Afrikaans - Green
            'rgba(139, 92, 246, 0.7)'   // Zulu - Purple
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  initializeLeadTrendChart(): void {
    // Dummy data for the line chart
    // This would be replaced with real data from your API
    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];

    // Destroy existing chart if it exists
    if (this.leadTrendChart) {
      this.leadTrendChart.destroy();
    }

    const ctx = document.getElementById('leadTrendChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.leadTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weekLabels,
        datasets: [
          {
            label: 'New Leads',
            data: Array(8).fill(this.reportData.newLeads).map((val, i) => val - (Math.random() * 10)),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Converted Leads',
            data: Array(8).fill(this.reportData.convertedLeads).map((val, i) => val - (Math.random() * 5)),
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }

  initializeAccidentYearChart(): void {
    // Destroy existing chart if it exists
    if (this.accidentYearChart) {
      this.accidentYearChart.destroy();
    }

    const ctx = document.getElementById('accidentYearChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.accidentYearChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['2025', '2024', '2023', '2022', '2021', 'Other'],
        datasets: [{
          data: [
            this.reportData.totalAccidentDatesIn2025,
            this.reportData.totalAccidentDatesIn2024,
            this.reportData.totalAccidentDatesIn2023,
            this.reportData.totalAccidentDatesIn2022,
            this.reportData.totalAccidentDatesIn2021,
            this.reportData.totalAccidentDatesOther
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // 2025 - Blue
            'rgba(16, 185, 129, 0.7)',  // 2024 - Green
            'rgba(245, 158, 11, 0.7)',  // 2023 - Amber
            'rgba(139, 92, 246, 0.7)',  // 2022 - Purple
            'rgba(236, 72, 153, 0.7)',  // 2021 - Pink
            'rgba(107, 114, 128, 0.7)'  // Other - Gray
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(107, 114, 128, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((context.raw as number) / total * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}
