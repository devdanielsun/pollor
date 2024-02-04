import { Component } from '@angular/core';
import { AuthService } from '../_auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {

    this.isAuthenticated = this.authService.isAuthenticated()
    this.isAdmin = this.authService.isRole('admin');

    authService.emitToken.subscribe(token => this.changeIsAuthenticated(token));
    authService.emitRole.subscribe(role => this.changeIsAdmin(role));
  }

  private changeIsAuthenticated(token: string): void {
    this.isAuthenticated = token ? true : false;
  }

  private changeIsAdmin(role: string): void {
    if (role && role.toLowerCase() == 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
