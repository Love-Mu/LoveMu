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
  err: string;
  locations = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
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
    this.http.post('https://lovemu.compsoc.ie/auth/register', userData, {withCredentials: true}).subscribe(res => {      
      this.authService.setUserInfo(res['token'], res['id']);
      if (this.authService.isAuthenticated()) {
        this.cookieService.delete("fileCookie");
        this.http.post('https://lovemu.compsoc.ie/upload/save', {filename:this.image, cookie:this.cookie}).subscribe();
        window.location.href= 'https://lovemu.compsoc.ie/spotify/reqAccess';
      }
    }, e => {
      if (e instanceof HttpErrorResponse) {
        this.err = e.error.message
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