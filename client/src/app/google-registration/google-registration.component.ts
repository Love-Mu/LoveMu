import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../users/User';

import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-google-registration',
  templateUrl: './google-registration.component.html',
  styleUrls: ['./google-registration.component.css']
})
export class GoogleRegistrationComponent implements OnInit {
  user: User;
  public isCurrentUser: boolean;
  registrationForm;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private userService: UsersService, private authService: AuthenticationService, private route: ActivatedRoute) {
    this.registrationForm = this.formBuilder.group({
      user_name: '',
      fname: '',
      sname: '',
      location: '',
      image: '',
      gender: '',
      sexuality: '',
      dob: '',
      bio: ''
    });
  }


  ngOnInit(): void {
    this.getUser();
  }

  getFormData(): void {
    this.registrationForm.controls['user_name'].setValue(this.user.user_name);
    this.registrationForm.controls['fname'].setValue(this.user.fname);
    this.registrationForm.controls['sname'].setValue(this.user.sname);
    this.registrationForm.controls['gender'].setValue(this.user.gender);
    this.registrationForm.controls['location'].setValue(this.user.location);
    this.registrationForm.controls['sexuality'].setValue(this.user.sexuality);
    this.registrationForm.controls['dob'].setValue(this.user.dob);
    this.registrationForm.controls['bio'].setValue(this.user.bio);
  }


  getUser(): void {
    this.userService.getUser(this.userService.getCurrentUser()).subscribe(
      user => {
        this.user = user;
        this.getFormData();
      }
    );
  }

  onSubmit(userData) {
    this.http.put(`https://lovemu.compsoc.ie/profiles/${this.userService.getCurrentUser()}`, userData).subscribe((res) => {
      window.location.href='https://lovemu.compsoc.ie/spotify/reqAccess';
    });
  }
}
