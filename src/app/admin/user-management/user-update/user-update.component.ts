import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
import { User, UserWithRoles } from '../../../_models/user.model';
import { TextInputComponent } from '../../../_shared/form-inputs/text-input/text-input.component';
import { CheckboxInputComponent } from '../../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [TextInputComponent, CheckboxInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  @Input() user: any;
  @Output() cancelRegister = new EventEmitter();
  userUpdateForm: FormGroup = new FormGroup({});
  userLocation ="KZN";
  locationOptions = ["KZN","CPT","JHB","PTA","DBN","PE","EL"];
  roleOptions: { [roleName: string]: boolean } = {
    "Admin": true,
    "Attorney": true,
    "Book Keeper": true,
    "Legal Secretary": true
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    //private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.configureRoleOptions();
    this.initializeForm();
  }

  configureRoleOptions() {
    var roles = this.user.roles
     console.log(this.user)

    // this.roleOptions = {
    //   "Admin": roles.includes("Admin"),
    //   "Attorney": roles.includes("Attorney"),
    //   "Book Keeper": roles.includes("Book Keeper"),
    //   "Legal Secretary": roles.includes("Legal Secretary")
    // }
  }

  initializeForm() {
    this.userUpdateForm = this.fb.group({
      knownAs: [this.user.knownAs, Validators.required],
      fullName: [this.user.fullName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      roles: [this.roleOptions, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  onSubmit(){

    if (this.userUpdateForm.invalid) {
      this.userUpdateForm.markAllAsTouched();
    }

    var roles = Object.keys(this.userUpdateForm.get('roles')!.value).filter(key => this.userUpdateForm.get('roles')!.value[key] === true)
      .join(',')//got rid of type saftey need to actually correct this
    const user: UserWithRoles = this.userUpdateForm.value;
    user.roles = roles;
    this.userService.updateUser(user);
    this.cancel();
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  delete() {
    this.userService.deleteUser(this.user.username);
    this.cancel();
  }

}
