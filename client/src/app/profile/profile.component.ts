import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Artist } from '../users/Artist';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SpotifyService } from '../spotify.service';
import { UploadService } from  '../upload.service';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { Track } from '../users/Track';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  @Input() update: EventEmitter<String>;
  user: User;
  artists: Artist[];
  blockedArtists: Artist[];
  public isCurrentUser: boolean;
  profileForm;
  playlistUrl: SafeResourceUrl;
  songUrl: SafeResourceUrl;
  public editUser: boolean;
  public editingArtist: boolean;
  oldFile: string;
  newFile: string;
  filePath: string;
  userID: string;
  message: string;
  searchResults: Array<Track>;
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute, private userService: UsersService, private authService: AuthenticationService, private sanitizer: DomSanitizer, public spotifyService: SpotifyService, private uploadService: UploadService) {
    this.profileForm = this.formBuilder.group({
      fname: '',
      sname: '',
      location: '',
      image: '',
      gender: '',
      sexuality: '',
      bio: '',
      user_name: '',
      dob: '',
      playlist: '',
      favouriteSong: '',
      q: '',
      blocked: ''
    });
  }

  ngOnInit(): void {
    this.getUser();
    if (this.update) {
      this.update.subscribe(() => {
          console.log("running");
          this.ngOnInit();
      });
    }
  }

  blockUser() {
    this.userService.blockUser(this.route.snapshot.paramMap.get('id'));
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
    if (id == null) id = currentId;
    this.userID = id.toString();

    if (currentId == id) {
      this.isCurrentUser = true;
    }
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.user = user;
      this.artists = user.artists;
      this.blockedArtists = user.blockedArtists;
      this.oldFile = user.image;
      this.newFile = user.image;
      this.filePath = user.image;
      console.log(user);
      if (this.user.favouriteSong != null) {
        this.user.favouriteSong = `https://open.spotify.com/embed/track/${this.user.favouriteSong.substring(34, this.user.favouriteSong.length)}`;
        this.songUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.user.favouriteSong);
      }
      if (this.user.playlist != null) {
        this.user.playlist = `https://open.spotify.com/embed/playlist/${this.user.playlist.substring(34, this.user.playlist.length)}`;
        this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.user.playlist);
      }
      this.getFormData();
    });
  }

  onSubmit(userData) {
    if(this.newFile != this.oldFile){
      userData.image = this.newFile;
    }
    this.checkFormData(userData);
    this.http.put('https://lovemu.compsoc.ie/profiles/' + this.userService.getCurrentUser(), userData).toPromise().then((res) => {
      this.user = res['user'];
      console.log(this.user);
      this.editUser = false;
      if(this.oldFile != this.newFile){
        this.http.post('https://lovemu.compsoc.ie/upload/update', {oldFile:this.oldFile, newFile:this.newFile}).subscribe(() => {
          this.ngOnInit();
        });
      } else {
        this.ngOnInit();
      }
    });

  }

  uploadFile(file) {
    const formData = new FormData(); 
    formData.append('file', file.data); 
    file.inProgress = true;  
    this.uploadService.update(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        return of(`${file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') { 
          if(event.body.message){
            this.message = event.body.message;
          }
          else{
            this.newFile = event.body.newFile;
            this.filePath = "temp/" + this.userID + "/" + this.newFile; 
            this.message = "";
          }
          
          console.log(event.body);  
        }  
        else {
          this.newFile = "default.png";
        }
      });  
  }

  private uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
    this.files = [];
    return true;
  }

  onClick() {  
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {  
      for (let index = 0; index < fileUpload.files.length; index++)  {  
        const file = fileUpload.files[0];  
        this.files.push({ data: file, inProgress: false, progress: 0});  
      }  
      this.uploadFiles(); 
    };  
    fileUpload.click();  
  }

  search(query, type) {
    if (query != '') {
      this.http.post("https://lovemu.compsoc.ie/spotify/refreshAccess", {}).toPromise().then(() => {
        this.http.post("https://lovemu.compsoc.ie/spotify/search", {query: query, type: type}).subscribe((res) => {
          this.searchResults = res['items'];
        });
      });
    }
  }

  removeArtist(artist) {
    this.http.post("https://lovemu.compsoc.ie/profiles/removeArtist", {artist: artist}).toPromise().then((res) => {
      this.blockedArtists = res['blockedArtists'];
      this.artists = res['artists'];
    });
  }

  addArtist(artist) {
    this.http.post("https://lovemu.compsoc.ie/profiles/addArtist", {artist: artist}).toPromise().then((res) => {
      this.blockedArtists = res['blockedArtists'];
      this.artists = res['artists'];
    });
  }

  flipEditingArtist() {
    this.editingArtist = !this.editingArtist;
  }
}
