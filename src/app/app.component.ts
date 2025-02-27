import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './_services/account.service';
import { NotificationComponent } from './_shared/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  notificationType = 'success';
  NotificationVisible = false

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  displayNotification(type: string, showNotification: boolean) {
    this.notificationType = type;
    this.NotificationVisible = showNotification;
    setTimeout(() => {
      this.NotificationVisible = false
    }, 2000);
  }
}
