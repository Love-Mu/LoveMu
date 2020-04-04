import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  registrationForm;
  msg: string;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private userService: UsersService, private authService: AuthenticationService, private route: ActivatedRoute) {
    this.registrationForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      fname: ['', [Validators.required, Validators.maxLength(30)]],
      sname: ['', [Validators.required, Validators.maxLength(30)]],
      location: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      sexuality: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(240)]]
    });
  }


  ngOnInit(): void {
    this.getUser();
  }

  getFormData(): void {
    this.registrationForm.controls['fname'].setValue(this.user.fname);
    this.registrationForm.controls['sname'].setValue(this.user.sname);
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
      if (res['message'] == 'Successful Update!') {
        window.location.href='https://lovemu.compsoc.ie/spotify/reqAccess';
      } else {
        this.msg == res['message'];
      }
    });
  }
  
  get user_name() { return this.registrationForm.get('user_name') }
  get fname() { return this.registrationForm.get('fname') }
  get sname() { return this.registrationForm.get('sname') }
  get location() { return this.registrationForm.get('location') }
  get dob() { return this.registrationForm.get('dob') }
  get gender() { return this.registrationForm.get('gender') }
  get sexuality() { return this.registrationForm.get('sexuality') }
  get bio() { return this.registrationForm.get('bio') }
}
