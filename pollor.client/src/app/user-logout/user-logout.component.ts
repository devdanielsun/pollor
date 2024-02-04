import { Component } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { AlertMessage } from '../alert-message/alert-message';

@Component({
  selector: 'app-user-logout',
  templateUrl: './user-logout.component.html',
  styleUrl: './user-logout.component.css'
})
export class UserLogoutComponent {
  constructor(
    private authService: AuthService,
    private alertMessage: AlertMessage) {
    this.authService.logout();
    this.alertMessage.addInfoAlert("You logged out !", "Bye bye :)");
  }
}
