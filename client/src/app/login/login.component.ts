import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }
  ngOnInit() {
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password).then((res) => {
      this.authService.setUserInfo({'user': res['user']});
    });
    this.router.navigate(['users'])
  }
}
