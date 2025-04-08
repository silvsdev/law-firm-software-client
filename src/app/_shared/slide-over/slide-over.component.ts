import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
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
    trigger('fadeBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ])
  ],
  styleUrl: './slide-over.component.css'
})
export class SlideOverComponent implements OnInit, OnDestroy {

  @Input() panelTitle: string = 'Panel Title';

  constructor(
    public slideOver: SlideoverService,
    public el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Disable body scrolling when slide-over opens
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  ngOnDestroy(): void {
    // Re-enable body scrolling when slide-over closes
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  closeSlideOver() {
    // This triggers the leave animation
    this.slideOver.beginClosing();
  }

  // Handle animation completion
  onAnimationDone(event: AnimationEvent) {
    // If this is the end of a leave animation
    if (event.toState === 'void' && event.phaseName === 'done') {
      this.slideOver.animationDone();
      // If we were closing, actually close now that animation is done
      if (!this.slideOver.isVisible) {
        this.slideOver.closeSlideOver();
      }
    }
  }
}
