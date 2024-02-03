import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-admin-profile',
  templateUrl: './user-admin-profile.component.html',
  styleUrl: './user-admin-profile.component.css'
})
export class UserAdminProfileComponent {

  constructor(private authService: AuthService) {
    this.authService.logoutIfUserDoesNotValidate(); // redirect to logout if user or token is not ok
    this.authService.redirectIfUserIsNotAdmin(); // redirect to 404 not found page if user is not admin
  }
}
