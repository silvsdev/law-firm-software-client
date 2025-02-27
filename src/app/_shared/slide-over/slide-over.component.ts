import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SlideoverService } from '../../_services/slideover.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-over.component.html',
  animations: [
    trigger('translateX', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  styleUrl: './slide-over.component.css'
})
export class SlideOverComponent implements OnInit {

  @Input() panelTitle: string ='fdgfd';

  registerMode = false;
  constructor(public slideOver: SlideoverService, public el: ElementRef) {}

  ngOnInit(): void {
  }

  closeSlideOver() {
    this.slideOver.closeSlideOver();
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

  // closeSlideOver1(event: boolean) {
  //   this.slideOver.closeSlideOver();
  // }
}

