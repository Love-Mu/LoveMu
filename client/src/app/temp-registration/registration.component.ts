import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  '../upload.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  registrationForm;
  msg: string;
  image: string;
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];  
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private http: HttpClient, private uploadService: UploadService) {
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
    userData.image = this.image;
    this.http.post('https://lovemu.compsoc.ie/auth/register', userData, {withCredentials: true}).subscribe((res) => {
      this.msg = JSON.stringify(res['message']);
      this.authService.setUserInfo(res['token'], res['id']);
      if (this.authService.isAuthenticated()) {
        window.location.href= 'https://lovemu.compsoc.ie/spotify/reqAccess';
      }
    });
  }
  
  uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this.uploadService.upload(formData).pipe(  
      map(event => {    
            return event;  
      }),   
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        return of(`${file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body); 
          this.image = event.body.filepath;
        }  
      });  
  }

  private uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
  }

  onClick() {  
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {  
    for (let index = 0; index < fileUpload.files.length; index++)  
    {  
    const file = fileUpload.files[index];  
    this.files.push({ data: file, inProgress: false, progress: 0});  
    }  
      this.uploadFiles();  
    };  
    fileUpload.click();  
  }
}