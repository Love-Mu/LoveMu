import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  registrationForm;
  msg: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private http: HttpClient) {
    this.registrationForm = this.formBuilder.group({
      email: '',
      password: '',
      user_name: '',
      fname: '',
      sname: '',
      location: '',
      dob: '',
      image: '',
      gender: '',
      sexuality: '',
      bio: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(userData) {
    this.http.post('https://lovemu.compsoc.ie/auth/register', userData).subscribe((res) => {
      this.msg = JSON.stringify(res['message']);
      if (res['user'] != null) {
        this.authService.setUserInfo({'user': res['user']});
        window.location.href= 'https://lovemu.compsoc.ie/spotify/reqAccess';
      }
    });
  }
}