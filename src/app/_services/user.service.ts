import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, UserWithPassword, UserWithRoles } from '../_models/user.model';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = signal<UserWithRoles[]>([]);
  baseUrl = environment.apiUrl + 'user';
  private notificationService = inject(NotificationService);

  constructor(private http: HttpClient) { }

  addUser(user: UserWithPassword) {
    return this.http.post<User>(this.baseUrl, user).subscribe({
      next: () => {
        this.notificationService.notifyOnSuccess('User created successfully');
        this.getUsers()
    }
    });
  }

  getUsers() {
    return this.http.get<UserWithRoles[]>(this.baseUrl).subscribe({
      next: users => this.users.set(users)
    })
  }

  getAttorneys() {
    return this.http.get<string[]>(this.baseUrl + '/attorneys');
  }

  updateUser(user: UserWithRoles) {
    return this.http.put<User>(this.baseUrl, user).subscribe({
      next: () => {
        this.notificationService.notifyOnSuccess('User updated successfully');
        this.getUsers()
    }
    });
  }

  deleteUser(username: string) {
    return this.http.delete(this.baseUrl + '/' + username).subscribe({
      next: () => {
        this.notificationService.notifyOnSuccess('User deleted successfully');
        this.getUsers()
    }
    });
  }
}
