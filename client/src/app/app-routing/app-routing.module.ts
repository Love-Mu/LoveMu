import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent} from '../profile/profile.component';
import { LogoutComponent} from '../logout/logout.component';
import { HomeComponent} from '../home/home.component';
import { MessageComponent } from '../message/message.component';
//import { MessageTestComponent } from '../message-test/message-test.component';
import { AuthGuardService } from '../auth-guard.service';
import { GoogleRegistrationComponent} from '../google-registration/google-registration.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'users/:id', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService]},
  //{ path: 'messageTest', component: MessageTestComponent, canActivate: [AuthGuardService] },
  { path: 'message', component: MessageComponent, canActivate: [AuthGuardService] },
  { path: 'message/:id', component: MessageComponent, canActivate: [AuthGuardService] },
  { path: 'google', component: GoogleRegistrationComponent},
  { path: '**', redirectTo: '' } // otherwise redirect to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
