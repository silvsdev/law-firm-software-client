import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../_shared/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsOverviewComponent {


}
