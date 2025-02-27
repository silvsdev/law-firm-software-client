import { Component, inject, OnInit } from '@angular/core';
import { SlideOverComponent } from '../../../_shared/slide-over/slide-over.component';
import { UserCreateComponent } from '../user-create/user-create.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../_services/user.service';
import { User, UserWithRoles } from '../../../_models/user.model';
import { UserUpdateComponent } from '../user-update/user-update.component';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [SlideOverComponent, UserCreateComponent, UserUpdateComponent, CommonModule],
  templateUrl: './user-overview.component.html'
})
export class UserOverviewComponent implements OnInit {
  user: any;
  public userService = inject(UserService);
  registerMode = false;
  editMode = false;
  panelTitle = 'Add new user';

  ngOnInit(): void {
    if (this.userService.users.length === 0) this.loadUsers();
  }

  addUser(){
    this.panelTitle = 'Add new user';
    this.editMode = false;
    this.registerMode = true;
  }

  loadUsers() {
    this.userService.getUsers();
  }

  // editUser(user: User) {
  editUser(user: UserWithRoles) {
    this.user = user;
    this.panelTitle = 'Edit user';
    this.registerMode = false;
    this.editMode = true;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.editMode = event;
  }

}
