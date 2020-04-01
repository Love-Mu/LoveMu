import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NavbarComponent} from "./navbar/navbar.component";
import {MatToolbarModule} from '@angular/material/toolbar';
import {CookieService} from 'ngx-cookie-service';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {AppComponent} from './app.component';
import {UsersComponent} from './users/users.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {ProfileComponent} from './profile/profile.component';
//import { MessageTestComponent } from './message-test/message-test.component';
import { MessageComponent } from './message/message.component';
import {AuthInterceptor} from './authInterceptor';
import { GoogleRegistrationComponent } from './google-registration/google-registration.component';
import { FileListComponent } from './file-list/file-list.component';

const config: SocketIoConfig = { url: 'https://lovemu.compsoc.ie/', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    NavbarComponent,
//    MessageTestComponent,
    MessageComponent,
    GoogleRegistrationComponent,
    FileListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatToolbarModule,
    MatGridListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterTestingModule,
    SocketIoModule.forRoot(config),
    ScrollingModule,
    MatProgressBarModule
  ],
  providers: [
    CookieService,
    MatNativeDateModule,
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
