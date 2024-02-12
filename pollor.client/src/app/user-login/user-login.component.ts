import { Component } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AlertMessage } from '../alert-message/alert-message';
import { ApiService } from '../_api/api.service';

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
    private apiService: ApiService,
    private alertMessage: AlertMessage
  ) {
    this.loginForm = formBuilder.group({
      username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      tokenLongerValid: [false, Validators.required]
    });

    if (this.authService.isAuthenticated()) {
      this.validateUserAndRedirectToProfile(); // validate and navigate to role profile page
    }
  }

  get getUsername(): AbstractControl { return this.loginForm.get('username')!; }
  get getPassword(): AbstractControl { return this.loginForm.get('password')!; }

  sendLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Start the loading spinner
      this.apiService
        .login(this.loginForm.value)
        .pipe(
          finalize(() => {
            this.loading = false; //Stop the loading spinner
          })
        )
        .subscribe({
          next: (res: any) => {
            this.loginError = '';
            this.loginForm.reset();
            this.authService.setToken(res.token);
            this.authService.navigateDashboard();
            this.alertMessage.addSuccessAlert("Login is successfull", `Welcome ${res.user.username} :)`);
          },
          error: (err: any) => {
            const msg = ((err.error && err.error.message) ? err.error.message : err.message);
            this.loginError = err.status + ' - ' + msg;
            console.error('Login Error:', err);
            this.alertMessage.addErrorAlert("Login error", msg);
          },
        });
    }
  }

  validateUserAndRedirectToProfile(): any {
    this.loading = true; // Start the loading spinner
    this.apiService
      .validateToken()
      .pipe(
        finalize(() => {
          this.loading = false; //Stop the loading spinner
        })
      )
      .subscribe({
        next: (res: any) => {
          this.authService.navigateDashboard();
        },
        error: (err: any) => {
          const msg = ((err.error && err.error.message) ? err.error.message : err.message);
          this.loginError = err.status + ' - ' + msg;
          console.error('Token validation Error:', err);
          this.alertMessage.addErrorAlert("Token validation Error", msg);
        },
      });
  }
}
