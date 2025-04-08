import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatCard, MatCardTitle } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCard, MatCardTitle, MatButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit() {
    if(!this.authService.user$) {
      console.log('User not logged in');
    }
    if(this.authService.user$) {
      console.log('User is already logged in');
    this.router.navigate(['/projects']);
  }
}
  GoogleLogin() {
    this.authService.loginWithGoogle()
      .then(() => {
        console.log('Logged in with Google');
        this.router.navigate(['/projects']);
      })
      .catch(err => console.error(err));
  }
  
}
