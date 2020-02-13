import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router) {
    this.registrationForm = this.formBuilder.group({
      email: '',
      password: '',
      user_name: '',
      fname: '',
      sname: '',
      location: '',
      image: '',
      gender: '',
      sexuality: '',
      bio: ''
    });
  }
  ngOnInit() {
  }

  onSubmit(userData) {
    console.log(userData);
  }
}
