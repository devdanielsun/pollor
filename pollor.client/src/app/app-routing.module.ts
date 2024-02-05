import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './_auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './_auth/role-guard.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PollsComponent } from './polls/polls.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAdminProfileComponent } from './user-admin-profile/user-admin-profile.component';
import { UserLogoutComponent } from './user-logout/user-logout.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'account/login',
    component: UserLoginComponent
  },
  {
    path: 'account/register',
    component: UserRegisterComponent
  },
  {
    path: 'account/logout',
    component: UserLogoutComponent
  },
  {
    path: 'account/profile',
    component: UserProfileComponent,
    canActivate: [() => inject(AuthGuard).canActivate()]
  },
  {
    path: 'account/admin-profile',
    component: UserAdminProfileComponent,
    canActivate: [() => inject(RoleGuard).canActivate('admin')]
  },
  {
    path: 'polls',
    component: PollsComponent
  },
  {
    path: 'create-poll',
    component: CreatePollComponent,
    canActivate: [() => inject(AuthGuard).canActivate()]
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
