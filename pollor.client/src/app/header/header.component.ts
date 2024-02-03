import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  isAdmin(): boolean {
    return this.authService.getRole().toLowerCase() == "admin";
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
