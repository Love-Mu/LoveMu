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
    this.loginForm.get('email').valueChanges.subscribe((event) => {
      this.loginForm.get('email').setValue(event.toLowerCase(), {emitEvent: false});
    });
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password);
  }
}
