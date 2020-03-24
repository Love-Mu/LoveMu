import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-google-registration',
  templateUrl: './google-registration.component.html',
  styleUrls: ['./google-registration.component.css']
})
export class GoogleRegistrationComponent implements OnInit {
  registrationForm;
  msg: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private http: HttpClient, private userService: UsersService) {
    this.registrationForm = this.formBuilder.group({
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
    this.http.put(`https://lovemu.compsoc.ie/profile/${localStorage.getItem('id')}`, userData).subscribe((res) => {
      window.location.href= 'https://lovemu.compsoc.ie/spotify/reqAccess';
    });
  }
}
