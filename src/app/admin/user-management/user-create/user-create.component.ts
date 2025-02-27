import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../_shared/form-inputs/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent } from '../../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { UserWithPassword } from '../../../_models/user.model';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [TextInputComponent, CheckboxInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  @Input() emptyUser: any;

  userCreateForm: FormGroup = new FormGroup({});
  roleOptions: { [roleName: string]: boolean } = {
    "Admin": true,
    "Attorney": false,
    "Book Keeper": false,
    "Legal Secretary": false
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    //private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.userCreateForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles: [this.roleOptions, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]]
    });
  }

  onSubmit(){
    if (this.userCreateForm.invalid) {
      this.userCreateForm.markAllAsTouched();
    }

    const user: UserWithPassword = {
      knownAs: this.userCreateForm.get('username')!.value,
      fullName: this.userCreateForm.get('fullName')!.value,
      lastName: this.userCreateForm.get('lastName')!.value,
      email: this.userCreateForm.get('email')!.value,
      password: this.userCreateForm.get('password')!.value,
      roles: Object.keys(this.userCreateForm.get('roles')!.value).filter(key => this.userCreateForm.get('roles')!.value[key] === true)
      .join(',')//got rid of type saftey need to actually correct this
    }
    this.userService.addUser(user)
    this.cancel();
  }

  async cancel() {
    this.cancelRegister.emit(false);
  }

}
