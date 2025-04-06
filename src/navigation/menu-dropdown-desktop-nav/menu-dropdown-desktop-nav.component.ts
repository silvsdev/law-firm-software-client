import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../app/_services/account.service';

@Component({
  selector: 'app-menu-dropdown-desktop-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-dropdown-desktop-nav.component.html',
  styleUrl: './menu-dropdown-desktop-nav.component.css'
})
export class MenuDropdownDesktopNavComponent implements OnInit, OnDestroy {

  dropdownOpen = false;
  private accountService = inject(AccountService);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  private clickListener!: () => void;

  ngOnInit() {
    this.clickListener = this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.elementRef.nativeElement.contains(e.target)) {
        this.dropdownOpen = false;
      }
    });
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    if (this.clickListener) {
      this.clickListener();
    }
  }

  logout() {
    this.accountService.logout();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  settings() {
    // Implement settings logic
  }

  toggleTheme() {
    // Implement theme toggle logic
  }
}
