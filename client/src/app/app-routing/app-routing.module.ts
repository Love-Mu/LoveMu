import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent} from '../profile/profile.component';
import { LogoutComponent} from '../logout/logout.component';
import { HomeComponent} from '../home/home.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'users/:id', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
