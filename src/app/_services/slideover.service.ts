import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Islideover {
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SlideoverService {
    private currentUserSource = new BehaviorSubject<Islideover | null>(null);
    currentSlideoverState$ = this.currentUserSource.asObservable();
    private slideover: Islideover | null = null;

    constructor() {}

    openSlideover() {
      if (!this.slideover) {
        this.slideover = { visible: true };
      } else {
        this.slideover.visible = true;
      }
      this.currentUserSource.next(this.slideover);
    }

    closeSlideOver() {
      if (!this.slideover) {
        this.slideover = { visible: false };
      } else {
        this.slideover.visible = false;
      }
      this.currentUserSource.next(this.slideover);
    }
  }
