import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  public isCurrentUser: boolean;
  profileForm;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute, private userService: UsersService, private authService: AuthenticationService) {
    this.profileForm = this.formBuilder.group({
      fname: '',
      sname: '',
      location: '',
      image: '',
      gender: '',
      sexuality: '',
      bio: ''
    });
  }


  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let currentId = this.userService.getCurrentUser();

    if (currentId == id) {
      this.isCurrentUser = true;
    }
    this.userService.getUser(id.toString()).subscribe(user => this.user = user);
  }

  onSubmit(userData) {
    if (!userData.fname) userData.fname = this.user.fname;
    if (!userData.sname) userData.sname = this.user.sname;
    if (!userData.gender) userData.gender = this.user.gender;
    if (!userData.location) userData.location = this.user.location;
    if (!userData.image) userData.image = this.user.image;
    if (!userData.sexuality) userData.sexuality = this.user.sexuality;
    if (!userData.fname) userData.fname = this.user.fname;
    if (!userData.bio) userData.bio = this.user.bio;
    this.http.put('https://lovemu.compsoc.ie/profiles/' + this.userService.getCurrentUser(), userData, {withCredentials: true}).subscribe((res) => {
      console.log("Amendments Made")
    });
    console.log(userData);
  }
}