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
  }

  sendLogin(): void {
    if (this.loginForm.valid) {
      console.log('this.loginForm.valid', this.loginForm.valid);
      this.loading = true; // Start the loading spinner

      console.log('this.loginForm.value', this.loginForm.value);

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
            console.log('Show me the success - ', res.role, res)
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
            this.loginError = '';
            this.loginForm.reset();
            this.navigateDashboard(res.role);
          },
          error: (error: any) => {
            this.loginError = 'An error occurred during login.';
            console.error('Login Error:', error);
            AlertMessage.addErrorAlert(error.message);
          },
        });
    }
  }

  navigateDashboard(role: string): void {
    const dashboardRoute =
      role === 'admin' ? '/admindashboard' : '/userdashboard';
    this.router.navigate([dashboardRoute]);
    console.log(`${role} dashboard route`);
  }
}
