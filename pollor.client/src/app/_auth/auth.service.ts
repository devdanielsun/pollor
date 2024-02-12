import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../_interfaces/jwt-payload.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  @Output() emitToken: EventEmitter<any> = new EventEmitter();
  @Output() emitRole: EventEmitter<any> = new EventEmitter();


  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  public setToken(token: string) {
    localStorage.setItem('token', token);
    const role = this.getRole();
    this.emitToken.emit(token);
    this.emitRole.emit(role);
  }

  public getToken(): string {
    return localStorage.getItem("token")!;
  }

  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  public isRole(expectedRole: string) {
    if (!this.isAuthenticated() || this.getRole().toLowerCase() !== expectedRole.toLowerCase()) {
      return false;
    }
    return true;
  }

  public getRole() {
    // decode the token to get its payload
    const token = this.getToken();
    const tokenPayload = jwtDecode(token) as JwtPayload;
    return tokenPayload.userRole.toLowerCase();
  }

  public logout() {
    localStorage.removeItem("token");
    this.emitToken.emit(undefined);
    this.emitRole.emit(undefined);
    this.router.navigate(['account/login']);
  }

  public navigateDashboard(): void {
    const dashboardRoute = this.getRole().toLowerCase() === 'admin' ? '/account/adminpanel' : '/account';
    this.router.navigate([dashboardRoute]);
  }
}
