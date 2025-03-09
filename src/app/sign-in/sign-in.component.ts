import { Component, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../_shared/form-inputs/text-input/text-input.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  loginForm :FormGroup = new FormGroup({});
  accountService = inject(AccountService);
  private router = inject(Router)
  model: any = {};

  login() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: _ => {
        this.router.navigateByUrl('/dashboard')
      },
      // error: error => this.toastr.error(error.error)
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

   onSubmit(){

    console.log(this.loginForm.value);

  }

}
