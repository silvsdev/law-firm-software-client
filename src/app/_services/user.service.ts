import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, UserWithPassword, UserWithRoles } from '../_models/user.model';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Attorney } from '../_models/attorney.model';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = signal<UserWithRoles[]>([]);
  baseUrl = environment.apiUrl + 'user';
  loading = signal<boolean>(false);
  private notificationService = inject(NotificationService);

  constructor(private http: HttpClient) { }

  addUser(user: UserWithPassword) {
    this.loading.set(true);
    return this.http.post<User>(this.baseUrl, user)
      .pipe(
        catchError(error => {
          this.notificationService.notifyOnError('Failed to create user');
          console.error('Error creating user:', error);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.notifyOnSuccess('User created successfully');
            this.getUsers();
          }
        }
      });
  }

  getUsers() {
    this.loading.set(true);
    return this.http.get<UserWithRoles[]>(this.baseUrl)
      .pipe(
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load users');
          console.error('Error loading users:', error);
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: users => this.users.set(users || [])
      });
  }

  getAttorneys() {
    this.loading.set(true);
    return this.http.get<Attorney[]>(this.baseUrl + '/attorneys')
      .pipe(
        catchError(error => {
          this.notificationService.notifyOnError('Failed to load attorneys');
          console.error('Error loading attorneys:', error);
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  updateUser(user: UserWithRoles) {
    this.loading.set(true);
    return this.http.put<User>(this.baseUrl, user)
      .pipe(
        catchError(error => {
          this.notificationService.notifyOnError('Failed to update user');
          console.error('Error updating user:', error);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.notifyOnSuccess('User updated successfully');
            this.getUsers();
          }
        }
      });
  }

  deleteUser(username: string) {
    this.loading.set(true);
    return this.http.delete(this.baseUrl + '/' + username)
      .pipe(
        catchError(error => {
          this.notificationService.notifyOnError('Failed to delete user');
          console.error('Error deleting user:', error);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.notificationService.notifyOnSuccess('User deleted successfully');
          this.getUsers();
        }
      });
  }
}
