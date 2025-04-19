import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
  animations: [
    trigger('menuAnimation', [
      state('void', style({ transform: 'translateY(-100%)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', animate('300ms ease-in-out')),
      transition('* => void', animate('300ms ease-in-out')),
    ]),
  ],
})
export class MobileNavComponent {
  isMenuOpen = false;
  accountService = inject(AccountService);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(){
    this.isMenuOpen = false;
  }
}
