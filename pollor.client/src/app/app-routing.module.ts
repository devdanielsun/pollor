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
import { PollComponent } from './poll/poll.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'account',
    children: [
      {
        path: '',
        component: UserProfileComponent,
        canActivate: [() => inject(AuthGuard).canActivate()],
      },
      {
        path: 'login',
        component: UserLoginComponent
      },
      {
        path: 'register',
        component: UserRegisterComponent
      },
      {
        path: 'logout',
        component: UserLogoutComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [() => inject(AuthGuard).canActivate()]
      },
      {
        path: 'adminpanel',
        component: UserAdminProfileComponent,
        canActivate: [() => inject(RoleGuard).canActivate('admin')]
      },
    ]
  },
  {
    path: 'polls',
    component: PollsComponent
  },
  {
    path: 'poll/:id',
    component: PollComponent
  },
  {
    path: 'create-poll',
    component: CreatePollComponent,
    canActivate: [() => inject(AuthGuard).canActivate()]
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
