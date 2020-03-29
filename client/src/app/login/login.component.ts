import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router : Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
    this.matIconRegistry.addSvgIcon(
      `google`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/btn_google.svg`)
    );
  }
  ngOnInit() {
    this.loginForm.get('email').valueChanges.subscribe((event) => {
      this.loginForm.get('email').setValue(event.toLowerCase(), {emitEvent: false});
    });
  }

  onSubmit(userData) {
    this.authService.validate(userData.email, userData.password);
  }
}
