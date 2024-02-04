import { Component } from '@angular/core';
import { AuthService } from '../_auth/auth.service';

@Component({
  selector: 'app-user-admin-profile',
  templateUrl: './user-admin-profile.component.html',
  styleUrl: './user-admin-profile.component.css'
})
export class UserAdminProfileComponent {

  constructor(private authService: AuthService) {
  }
}
