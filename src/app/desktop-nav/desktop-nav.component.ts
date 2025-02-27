import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-desktop-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.css'
})
export class DesktopNavComponent {

  private accountService = inject(AccountService)

  logout() {
    this.accountService.logout();
  }

}
