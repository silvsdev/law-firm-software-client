import { Component } from '@angular/core';
import { BarChartComponent } from "../bar-chart/bar-chart.component";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

}
