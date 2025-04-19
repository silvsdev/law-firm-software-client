import { Component, inject, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Analytics } from '../../_models/analytics.model';
import { AnalyticsService } from '../../_services/analytics.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  @Input() type: string = 'bar';
  @Input() analyticsData?: Analytics;

  analyticsService = inject(AnalyticsService);
  chart: any = [];

  constructor() {}

  ngOnInit(): void {
    if (this.type === 'FileType') {
      // Handle FileType specific logic
    } else if (!this.analyticsData) {
      // Only fetch data if it wasn't provided as an input
      this.getFileAssignments();
    } else {
      // Use the provided data
      this.renderChart();
    }
  }

  getFileAssignments() {
    this.analyticsService.getFileAssignments().subscribe({
      next: response => {
        if (response) {
          // Your service now returns the body directly, not wrapped in response.body
          const chartId = 'canvass';
          const label = '# of Active Files';
          const labels = response?.labels || [];
          const data = response?.data || [];
          this.generateBarGraph(labels, data, chartId, label);
        }
      },
      error: error => {
        console.error('Error fetching file assignments for chart', error);
      }
    });
  }

  renderChart() {
    if (this.analyticsData) {
      const chartId = 'canvass';
      const label = '# of Active Files';
      this.generateBarGraph(
        this.analyticsData.labels || [],
        this.analyticsData.data || [],
        chartId,
        label
      );
    }
  }

  generateBarGraph(labels: string[], data: number[], chartId: string, label: string) {
    // Destroy existing chart if it exists
    if (this.chart && this.chart.destroy) {
      this.chart.destroy();
    }

    this.chart = new Chart(chartId, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: 'rgb(99, 102, 241)', // Set the background color
            borderColor: 'rgb(165, 180, 252)', // Set the border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
