import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuardService {
  constructor(public auth: AuthService, public router: Router) { }

  canActivate(expectedRole: string): boolean {
    if (!this.auth.isRole(expectedRole)) {
      this.router.navigate(['unauthorized']);
      return false;
    }
    return true;
  }
}
