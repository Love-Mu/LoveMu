import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Artist } from '../users/Artist';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User;
  artists: Artist[];
  public isCurrentUser: boolean;
  profileForm;
  playlistUrl: SafeResourceUrl;
  songUrl: SafeResourceUrl;
  public editUser: boolean

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute, private userService: UsersService, private authService: AuthenticationService, private sanitizer: DomSanitizer, public spotifyService: SpotifyService) {
    this.profileForm = this.formBuilder.group({
      fname: '',
      sname: '',
      location: '',
      image: '',
      gender: '',
      sexuality: '',
      bio: '',
      user_name: '',
      dob: ''
    });
  }


  ngOnInit(): void {
    this.getUser();
  }

  getFormData(): void {
    this.profileForm.controls['fname'].setValue(this.user.fname);
    this.profileForm.controls['sname'].setValue(this.user.sname);
    this.profileForm.controls['gender'].setValue(this.user.gender);
    this.profileForm.controls['location'].setValue(this.user.location);
    this.profileForm.controls['sexuality'].setValue(this.user.sexuality);
    this.profileForm.controls['user_name'].setValue(this.user.user_name);
    this.profileForm.controls['bio'].setValue(this.user.bio);
    this.profileForm.controls['gender'].setValue(this.user.gender);
    this.profileForm.controls['sexuality'].setValue(this.user.sexuality);
    this.profileForm.controls['dob'].setValue(this.user.dob);
  }

  checkFormData(userData): void {
    if (!userData.fname) userData.fname = this.user.fname;
    if (!userData.sname) userData.sname = this.user.sname;
    if (!userData.gender) userData.gender = this.user.gender;
    if (!userData.location) userData.location = this.user.location;
    if (!userData.image) userData.image = this.user.image;
    if (!userData.sexuality) userData.sexuality = this.user.sexuality;
    if (!userData.bio) userData.bio = this.user.bio;
    if (!userData.user_name) userData.user_name = this.user.user_name;
  }

  getUser(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let currentId = this.userService.getCurrentUser();

    if (currentId == id) {
      this.isCurrentUser = true;
    }
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.user = user;
      this.artists = user.artists;
      console.log(user);
      if (this.songUrl != '') {
        this.songUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.user.favouriteSong);
      }
      if (this.playlistUrl != '') {
        this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.user.playlist);
      }
      this.getFormData();
    });
  }

  onSubmit(userData) {
    this.checkFormData(userData);
    this.http.put('https://lovemu.compsoc.ie/profiles/' + this.userService.getCurrentUser(), userData).subscribe((res) => {
      this.editUser = false;
    });
  }

  
}
