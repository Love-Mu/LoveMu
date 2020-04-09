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
  locations = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

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
