import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../_shared/card/card.component';
import { BarChartComponent } from "../_shared/bar-chart/bar-chart.component";
import { LineChartComponent } from "../_shared/line-chart/line-chart.component";
import { AnalyticsService } from '../_services/analytics.service';
import { Analytics } from '../_models/analytics.model';
import { UserService } from '../_services/user.service';
import { CommonModule } from '@angular/common';
import { Metrics } from '../_models/metrics.model';
import { LegalFile } from '../_models/legalFile.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CardComponent, BarChartComponent, LineChartComponent, CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  analyticsService = inject(AnalyticsService);

  public userService = inject(UserService);

  attorneys: string[] = [];
  analyticsData: Analytics = {
    data: [],
    labels: []
  }

  perscribingFilesData: any;

  metricsData: Metrics = {
    totalFiles: 0,
    perscribingFileCount: 0
  }

  ngOnInit(): void {
    this.getFileAssignments();
    this.getAttorneys();
    this.getMetrics();
    //this.getTopPrescribingFiles();
  }

  getAttorneys() {
    this.userService.getAttorneys().subscribe((attorneys: string[]) => {
      this.attorneys = attorneys;
    });
  }

  getFileAssignments() {
    this.analyticsService.getFileAssignments().subscribe({
      next: response => {
        if (response.body) {
          this.analyticsData.labels = response.body?.labels;
          this.analyticsData.data = response.body?.data;
      }
    },
    })
  }

  getTopPrescribingFiles() {
    this.analyticsService.getRecentPerscribingFiles().subscribe({
      next: response => {
        if (response) {
          this.perscribingFilesData = response.body;
          console.log(this.perscribingFilesData);

      }
    }
    })
  }

  getMetrics() {
    this.analyticsService.getMetrics().subscribe({
      next: response => {
        if (response.body) {
          this.metricsData.totalFiles = response.body?.totalFiles;
          this.metricsData.perscribingFileCount = response.body?.perscribingFileCount;
      }
    },
    })
  }

}
