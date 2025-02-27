import { Component, inject, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
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

  analyticsService = inject(AnalyticsService);
  analyticsData: Analytics = {
    data: [],
    labels: []
  }


  chart: any = [];

  constructor() {}

  ngOnInit(): void {
    this.getPrescribingFilesByMonth();
  }

  getPrescribingFilesByMonth() {
    this.analyticsService.getPrescribingFilesByMonth().subscribe({
      next: response => {
        if (response.body) {
          var labels = response.body?.labels;
          var data = response.body?.data;
          this.generateLineChart(labels, data);
      }
    },
    })
  }

  generateLineChart(labels: string[], data: number[]) {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# Prescribing Files',
            data: data,
            backgroundColor: 'rgb(99, 102, 241)', // Set the background color
            borderColor: 'rgb(165, 180, 252)', // Set the border color
            borderWidth: 1,
          },
        ],
      },
      options: {

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

}

