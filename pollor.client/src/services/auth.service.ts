import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IAuth } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private router: Router) {
  }

  login<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/login', body);
  }

  register<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/register', body);
  }

  validateToken<T>(): Observable<T> {
    const auth: IAuth = {
      token: this.getToken(),
      role: this.getRole()
    }
    return this.apiService.post<T>('api/auth/validate', auth);
  }

  logout<T>(body: any): Observable<T> {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    this.router.navigate(["/account/login"]); // redirect to login
    return this.apiService.post<T>('api/auth/logout', body);
  }

  getToken() : string {
    return localStorage.getItem("token")!;
  }

  getRole() : string {
    return localStorage.getItem("role")!;
  }

  isLoggedIn() : boolean {
    if (this.getRole() && this.getToken()) {
      return true;
    }
    return false;
  }

  navigateDashboard(role: string): void {
    const dashboardRoute = role.toLowerCase() === 'admin' ? '/account/admin-profile' : '/account/profile';
    this.router.navigate([dashboardRoute]);
    console.log(`${role} dashboard route`);
  }

  logoutIfUserDoesNotValidate(): void {
    let isOk: boolean = false;

    if (this.isLoggedIn()) {
      const res = this.validateToken()
        .subscribe({
          next: (res: any) => {
            if (res && res.token) {
              isOk = true;
            }
          },
          error: (err: any) => {
            isOk = false;
          },
          complete: () => {
            if (isOk == false) {
              this.logout("please logout");
            }
          }
        });
    } else {
      this.logout("please logout");
    }
  }

  redirectIfUserIsNotAdmin(): void {
    let isOk: boolean = false;

    if (this.isLoggedIn()) {
      const res = this.validateToken()
        .subscribe({
          next: (res: any) => {
            if (res && res.token && res.user.role.toLowerCase() == "admin") {
              isOk = true;
            }
          },
          error: (err: any) => {
            isOk = false;
          },
          complete: () => {
            if (isOk == false) {
              this.router.navigate(["/unauthorized"]);
            }
          }
        });
    } else {
      this.router.navigate(["/unauthorized"]);
    }
  }
}
