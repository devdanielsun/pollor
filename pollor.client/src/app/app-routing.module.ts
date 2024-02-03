import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PollsComponent } from './polls/polls.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAdminProfileComponent } from './user-admin-profile/user-admin-profile.component';
import { UserLogoutComponent } from './user-logout/user-logout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account/login', component: UserLoginComponent },
  { path: 'account/register', component: UserRegisterComponent },
  { path: 'account/logout', component: UserLogoutComponent },
  { path: 'account/profile', component: UserProfileComponent },
  { path: 'account/admin-profile', component: UserAdminProfileComponent },
  { path: 'polls', component: PollsComponent },
  { path: '**', component: PageNotFoundComponent },  // route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
