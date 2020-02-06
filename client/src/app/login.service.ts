import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData;
  loginForm;

  constructor(private formBuilder: FormBuilder, private authService : AuthService) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password);
    this.loginForm.reset();
  }
}
