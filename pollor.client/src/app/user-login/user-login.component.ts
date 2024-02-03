import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertMessage } from '../alert-message/alert-message';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  loginError: string = '';
  loading: boolean = false;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      tokenLongerValid: [false, Validators.required]
    });

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      console.log("validate user");
      this.validateUser(); // validate and navigate to role profile page
    }
  }

  sendLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Start the loading spinner
      this.authService
        .login(this.loginForm.value)
        .pipe(
          finalize(() => {
            this.loading = false; //Stop the loading spinner
          })
        )
        .subscribe({
          next: (res: any) => {
            console.log('Response:', res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.user.role);
            this.loginError = '';
            this.loginForm.reset();
            this.navigateDashboard(res.user.role);
            AlertMessage.addSuccessAlert("Login is successfull !");
          },
          error: (err: any) => {
            const msg = (err.error.message ? err.error.message : err.message);
            this.loginError = err.status + ' - ' + msg;
            console.error('Login Error:', err);
            AlertMessage.addErrorAlert(msg);
          },
        });
    }
  }

  validateUser(): any {
    this.loading = true; // Start the loading spinner
    this.authService
      .validateToken()
      .pipe(
        finalize(() => {
          this.loading = false; //Stop the loading spinner
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('Response:', res);
          this.navigateDashboard(res.user.role);
        },
        error: (err: any) => {
          const msg = (err.error.message ? err.error.message : err.message);
          this.loginError = err.status + ' - ' + msg;
          console.error('Token validation Error:', err);
          AlertMessage.addErrorAlert(msg);
        },
      });
  }

  navigateDashboard(role: string): void {
    const dashboardRoute =
      role === 'admin' ? '/account/admin-profile' : '/account/profile';
    this.router.navigate([dashboardRoute]);
    console.log(`${role} dashboard route`);
  }
}
