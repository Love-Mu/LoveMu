import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData;
  loginForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router : Router) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password).then((res) => {
      this.authService.setUserInfo({'user': res['user']});
    });
    this.router.navigate(['users'])
  }
}
