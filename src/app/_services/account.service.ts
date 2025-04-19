import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../_models/user.model';
import { catchError, finalize, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  baseUrl = environment.apiUrl;
  loading = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  });

  /**
   * Check if the user has any of the specified roles
   * @param allowedRoles Array of role names to check against
   * @returns True if the user has at least one of the specified roles
   */
  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.roles();
    return allowedRoles.some(role => userRoles.includes(role));
  }

  /**
   * Login a user with credentials
   */
  login(model: any) {
    this.loading.set(true);
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
          this.notificationService.notifyOnSuccess('Successfully logged in');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.notificationService.notifyOnError(error.error || 'Failed to login');
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Register a new user account
   */
  register(model: any) {
    this.loading.set(true);
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
          this.notificationService.notifyOnSuccess('Successfully registered');
        }
        return user;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        this.notificationService.notifyOnError(error.error || 'Failed to register');
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Set the current user and store in local storage
   */
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  /**
   * Load user from local storage on application startup
   */
  loadCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user: User = JSON.parse(userString);
    this.currentUser.set(user);
  }

  /**
   * Log out the current user and clear stored data
   */
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
    this.notificationService.notifyOnSuccess('Successfully logged out');
  }
}
