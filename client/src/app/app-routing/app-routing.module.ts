import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { HomeComponent } from '../home/home.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth.service';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  { path: 'users', canActivate: [AuthGuardService], component: UsersComponent },
  { path: 'user', component: UsersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
