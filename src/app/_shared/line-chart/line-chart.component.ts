import { Component, inject, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'; // Fix Chart.js import
import { Analytics } from '../../_models/analytics.model';
import { AnalyticsService } from '../../_services/analytics.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  @Input() type: string = 'line';
  @Input() analyticsData?: Analytics;

  analyticsService = inject(AnalyticsService);
  chart: any = [];

  constructor() {}

  ngOnInit(): void {
    if (this.analyticsData) {
      // Use provided data if available
      this.generateLineChart(this.analyticsData.labels || [], this.analyticsData.data || []);
    } else {
      // Otherwise fetch data
      this.getPrescribingFilesByMonth();
    }
  }

  getPrescribingFilesByMonth() {
    this.analyticsService.getPrescribingFilesByMonth().subscribe({
      next: response => {
        if (response) {
          // Your service now returns the body directly
          const labels = response.labels || [];
          const data = response.data || [];
          this.generateLineChart(labels, data);
        }
      },
      error: error => {
        console.error('Error fetching prescribing files by month', error);
      }
    });
  }

  generateLineChart(labels: string[], data: number[]) {
    // Destroy existing chart if it exists
    if (this.chart && this.chart.destroy) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# Prescribing Files',
            data: data,
            backgroundColor: 'rgb(99, 102, 241)',
            borderColor: 'rgb(165, 180, 252)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true, // Add responsive option
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
