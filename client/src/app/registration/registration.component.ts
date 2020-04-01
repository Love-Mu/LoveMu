import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  '../upload.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer} from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  registrationForm;
  cookie: string;
  image: string = "default.png";
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private http: HttpClient, private uploadService: UploadService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private cookieService: CookieService) {
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password:['', Validators.required, Validators.min(5)],
      user_name: ['', Validators.required, Validators.min(5), Validators.max(20)],
      fname: ['', Validators.required, Validators.max(20)],
      sname: ['', Validators.required, Validators.max(20)],
      location: ['', Validators.required],
      dob: ['', Validators.required],
      image: '',
      gender: ['', Validators.required],
      sexuality: ['', Validators.required],
      bio: ['']
    });
  }

  ngOnInit() {  
    this.cookie = this.makeString();
    this.cookieService.set('tempuser', this.cookie);
  }

  makeString(): string {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 32; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }

  onSubmit(userData) {
    userData.image = this.image;
    this.http.post('https://lovemu.compsoc.ie/auth/register', userData, {withCredentials: true}).subscribe((res) => {
      this.http.post('https://lovemu.compsoc.ie/upload/save', {filename:this.image, cookie:this.cookie}).subscribe();
      this.authService.setUserInfo(res['token'], res['id']);
      if (this.authService.isAuthenticated()) {
        window.location.href= 'https://lovemu.compsoc.ie/spotify/reqAccess';
      }
    });
  }

  googleSubmit() {
    window.location.href='https://lovemu.compsoc.ie/auth/google';
  }

  
  uploadFile(file) {
      const formData = new FormData(); 
      formData.append('file', file.data); 
      file.inProgress = true;  
      this.uploadService.upload(formData).pipe(  
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
            this.image = event.body.filename;
            this.cookie = event.body.cookie; 
            console.log(event.body);  
          }  
          else {
            this.image = "default.png";
          }
        });  
    }

  private async uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
    return true;
  }

  onClick() {  
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {  
    for (let index = 0; index < fileUpload.files.length; index++)  
    {  
    const file = fileUpload.files[0];  
    this.files.push({ data: file, inProgress: false, progress: 0});  
    }  
       this.uploadFiles(); 
    };  
    fileUpload.click();  
  }
}