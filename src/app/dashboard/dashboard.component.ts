import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  accountService = inject(AccountService);

  emoji: string = '';
  greeting: string = '';
  userName: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.setGreeting();
    this.getUserName();
  }

  setGreeting(): void {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.greeting = 'Good morning';
      this.emoji = '🌅';
    } else if (currentHour < 18) {
      this.greeting = 'Good afternoon';
      this.emoji = '🙂';
    } else {
      this.greeting = 'Good evening';
      this.emoji = '🌆';
    }
  }


  getUserName(): void {
    const currentUser = this.accountService.currentUser();
    if (currentUser) {
      this.userName = currentUser.username; // Assuming the User model has a 'name' property
    }
  }

}
