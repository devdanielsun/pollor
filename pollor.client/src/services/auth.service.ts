import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';
import { IAuth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/login', body);
  }

  register<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/register', body);
  }

  validateToken<T>(): Observable<T> {
    const auth: IAuth = {
      token: AuthService.getToken(),
      role: AuthService.getRole()
    }
    return this.apiService.post<T>('api/auth/validate', auth);
  }

  logout<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/logout', body);
  }

  static getToken() : string {
    return localStorage.getItem("token")!;
  }

  static getRole() : string {
    return localStorage.getItem("role")!;
  }

  static isLoggedIn() : boolean {
    if (this.getRole() && this.getToken()) {
      return true;
    }
    return false;
  }
}
