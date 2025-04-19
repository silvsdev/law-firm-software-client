import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../app/_services/account.service';
import { CommonModule } from '@angular/common';
import { MenuDropdownDesktopNavComponent } from "../menu-dropdown-desktop-nav/menu-dropdown-desktop-nav.component";


@Component({
  selector: 'app-desktop-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, MenuDropdownDesktopNavComponent],
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.css'
})
export class DesktopNavComponent {

  accountService = inject(AccountService);

  dropdownOpen = false;

  // private accountService = inject(AccountService)

  logout() {
    this.accountService.logout();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}
