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
  cookie: string = "";
  image: string = "default.png";
  filePath: string = "default.png";
  message: string = "";
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private http: HttpClient, private uploadService: UploadService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private cookieService: CookieService) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      user_name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      fname: ['', [Validators.required, Validators.maxLength(30)]],
      sname: ['', [Validators.required, Validators.maxLength(30)]],
      location: ['', Validators.required],
      dob: ['', Validators.required],
      image: '',
      gender: ['', Validators.required],
      sexuality: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(240)]]
    });
  }

  ngOnInit() {  
    this.cookie = this.makeString();
    this.cookieService.set('fileCookie', this.cookie);
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
      
      this.authService.setUserInfo(res['token'], res['id']);
      if (this.authService.isAuthenticated()) {
        this.cookieService.delete("fileCookie");
        this.http.post('https://lovemu.compsoc.ie/upload/save', {filename:this.image, cookie:this.cookie}).subscribe();
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
            if(event.body.filename){
              this.image = event.body.filename;
              this.filePath = this.cookie + "/" + this.image;
              this. message = "";
            }
            if(event.body.message){
              this.message = event.body.message;
            }
            console.log(event.body);  
          }  
          else {
            this.image = "default.png";
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
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++)  {  
        const file = fileUpload.files[0];  
        this.files.push({ data: file, inProgress: false, progress: 0});  
      }  
      this.uploadFiles(); 
    };  
    fileUpload.click();  
  }

  get email() { return this.registrationForm.get('email') }
  get password() { return this.registrationForm.get('password') }
  get user_name() { return this.registrationForm.get('user_name') }
  get fname() { return this.registrationForm.get('fname') }
  get sname() { return this.registrationForm.get('sname') }
  get location() { return this.registrationForm.get('location') }
  get dob() { return this.registrationForm.get('dob') }
  get gender() { return this.registrationForm.get('gender') }
  get sexuality() { return this.registrationForm.get('sexuality') }
  get bio() { return this.registrationForm.get('bio') }
}