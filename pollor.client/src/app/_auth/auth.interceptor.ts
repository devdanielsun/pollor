import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private baseUrl = `${environment.API_URL}`;

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(this.baseUrl)) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    
      if (this.authService.getToken()) {
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Authorization', `Bearer ${this.authService.getToken()}`);
      };
    
      req = req.clone({ headers });
    }

    return next.handle(req);
  }
}
