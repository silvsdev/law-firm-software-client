import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../_shared/card/card.component';
import { BarChartComponent } from "../../_shared/bar-chart/bar-chart.component";
import { LineChartComponent } from "../../_shared/line-chart/line-chart.component";
import { AnalyticsService } from '../../_services/analytics.service';
import { Analytics } from '../../_models/analytics.model';
import { UserService } from '../../_services/user.service';
import { Metrics } from '../../_models/metrics.model';
import { LegalFile } from '../../_models/legalFile.model';
import { Attorney } from '../../_models/attorney.model';

@Component({
  selector: 'app-file-overview-report',
  standalone: true,
  imports: [CardComponent, BarChartComponent, LineChartComponent, CommonModule],
  templateUrl: './file-overview-report.component.html',
  styleUrl: './file-overview-report.component.css'
})
export class FileOverviewReportComponent implements OnInit {
  analyticsService = inject(AnalyticsService);
  public userService = inject(UserService);

  attorneys: string[] = [];
  analyticsData: Analytics = {
    data: [],
    labels: []
  }

  perscribingFilesData: LegalFile[] = [];

  metricsData: Metrics = {
    totalFiles: 0,
    perscribingFileCount: 0
  }

  loading = false;

  ngOnInit(): void {
    this.getFileAssignments();
    this.getAttorneys();
    this.getMetrics();
    this.getTopPrescribingFiles();
  }

  getAttorneys() {
    this.userService.getAttorneys().subscribe({
      next: (attorneys: Attorney[]) => {
        this.attorneys = attorneys.map(attorney => attorney.userName);
      },
      error: (error) => {
        console.error('Error fetching attorneys', error);
      }
    });
  }



  getFileAssignments() {
    this.loading = true;

    this.analyticsService.getFileAssignments().subscribe({
      next: (response) => {
        if (response) {
          this.analyticsData = {
            labels: response.labels || [],
            data: response.data || [],
            // Apply random colors for each bar
            
          };
          console.log('Loaded file assignments:', this.analyticsData);
        } else {
          this.analyticsData = { labels: [], data: [] };
        }
      },
      error: (error) => {
        console.error('Error fetching file assignments', error);
        this.analyticsData = { labels: [], data: [] };
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getTopPrescribingFiles() {
    this.loading = true;
    this.analyticsService.getRecentPerscribingFiles().subscribe({
      next: (response) => {
        if (response) {
          this.perscribingFilesData = response || [];
        }
      },
      error: (error) => {
        console.error('Error fetching prescribing files', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getMetrics() {
    this.loading = true;
    this.analyticsService.getMetrics().subscribe({
      next: (response) => {
        if (response) {
          this.metricsData.totalFiles = response?.totalFiles || 0;
          this.metricsData.perscribingFileCount = response?.perscribingFileCount || 0;
        }
      },
      error: (error) => {
        console.error('Error fetching metrics', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getDaysUntilPrescription(file: LegalFile): number {
    if (!file.prescriptionDate) return 999;
    const prescriptionDate = new Date(file.prescriptionDate);
    const today = new Date();
    const differenceInTime = prescriptionDate.getTime() - today.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  getPrescriptionStatus(file: LegalFile): string {
    const daysLeft = this.getDaysUntilPrescription(file);
    if (daysLeft <= 7) return 'Urgent';
    if (daysLeft <= 14) return 'Attention';
    return 'On Track';
  }

  // Generate a random color in hex format
getRandomColor(): string {
  // Generate vibrant colors by using higher saturation and value
  const hue = Math.floor(Math.random() * 360); // 0-359 (all hues)
  const saturation = 70 + Math.floor(Math.random() * 30); // 70-99% (high saturation)
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-59% (medium lightness for visibility)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generate random colors for each bar
generateRandomColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(this.getRandomColor());
  }
  return colors;
}
}
