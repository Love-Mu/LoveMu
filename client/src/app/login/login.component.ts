import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  err: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private http: HttpClient, private router : Router) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }
  ngOnInit() {
  }

  onSubmit(userData) {
    this.err = '';
    let email: string = userData.email;
    let password: string = userData.password;
    return this.http.post('https://lovemu.compsoc.ie/auth/login', {email, password}).subscribe((res) => {
      let token = res['token'];
      let id = res['id'];
      this.authService.setUserInfo(token, id);
      this.router.navigate(['/']);
    }, (e) => {
      if (e instanceof HttpErrorResponse) {
        this.err = e.error.message;
      }
    });
  }
}
