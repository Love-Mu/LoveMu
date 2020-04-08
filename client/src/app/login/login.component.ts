import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  err: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }
  ngOnInit() {
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password);
  }
}
