import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

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

  logout<T>(body: any): Observable<T> {
    return this.apiService.post<T>('api/auth/logout', body);
  }

}
