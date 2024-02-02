import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isAdmin(): boolean {
    return AuthService.getRole().toLowerCase() == "admin";
  }

  isLoggedIn(): boolean {
    return AuthService.isLoggedIn();
  }
}
