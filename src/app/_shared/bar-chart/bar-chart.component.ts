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

  analyticsService = inject(AnalyticsService);
  analyticsData: Analytics = {
    data: [],
    labels: []
  }


  chart: any = [];

  constructor() {}

  ngOnInit(): void {
    if(this.type === 'FileType') {

    }
    else {
    this.getFileAssignments();
    }
  }

  getFileAssignments() {
    this.analyticsService.getFileAssignments().subscribe({
      next: response => {
        if (response.body) {
          var chartId = 'canvass';
          var label = '# of Active Files';
          var labels = response.body?.labels;
          var data = response.body?.data;
          this.generateBarGraph(labels, data, chartId, label );
      }
    },
    })
  }


  generateBarGraph(labels: string[], data: number[], chartId: string, label: string) {

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
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }


}
