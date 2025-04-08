import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ISlideoverState {
  visible: boolean;
  animating?: boolean; // Track animation state
}

@Injectable({
  providedIn: 'root'
})
export class SlideoverService {
    // Renamed for clarity
    private slideoverStateSource = new BehaviorSubject<ISlideoverState>({ visible: false, animating: false });
    slideoverState$: Observable<ISlideoverState> = this.slideoverStateSource.asObservable();

    constructor() {}

    // Returns the current value synchronously when needed
    get isVisible(): boolean {
      return this.slideoverStateSource.value.visible;
    }

    get isAnimating(): boolean {
      return this.slideoverStateSource.value.animating || false;
    }

    openSlideover() {
      this.slideoverStateSource.next({ visible: true, animating: true });
    }

    closeSlideOver() {
      // Set animating to true, but keep visible true so component stays in DOM during animation
      this.slideoverStateSource.next({ visible: true, animating: true });

      // After animation duration, set visible to false
      // Animation is handled by @translateX.done in component
    }

    // Called by the component when animation is done
    animationDone() {
      const currentState = this.slideoverStateSource.value;

      // If we're animating and the intention was to close, now we can fully hide it
      if (currentState.animating) {
        this.slideoverStateSource.next({
          visible: currentState.visible,
          animating: false
        });
      }
    }

    beginClosing() {
      // Start the closing process - component will handle animation
      this.slideoverStateSource.next({ visible: false, animating: true });
    }

    toggleSlideover() {
      const currentState = this.slideoverStateSource.value;
      if (currentState.visible) {
        this.closeSlideOver();
      } else {
        this.openSlideover();
      }
    }
}
