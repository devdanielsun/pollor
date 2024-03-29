import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IAuth } from '../_interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  getBaseUrl() {
    return this.baseUrl;
  }

  get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const options = { params, headers };
    return this.http.get<T>(`${this.baseUrl}/${url}`, options);
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, options);
  }

  // Add methods for other HTTP verbs like put, patch, delete, etc.

  /* specific auth calls */

  login<T>(body: any): Observable<T> {
    return this.post<T>('api/auth/login', body);
  }

  register<T>(body: any): Observable<T> {
    return this.post<T>('api/auth/register', body);
  }

  validateToken<T>(): Observable<T> {
    const auth: IAuth = {
      token: localStorage.getItem("token")!
    }
    return this.post<T>('api/auth/validate', auth);
  }
}
