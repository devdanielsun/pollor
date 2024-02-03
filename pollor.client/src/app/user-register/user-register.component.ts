import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertMessage } from '../alert-message/alert-message';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {
  registerError: string = '';
  loading: boolean = false;
  registerForm: FormGroup;
  regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.registerForm = this.fb.group({
      emailaddress: new FormControl(null, [Validators.required, Validators.pattern(this.regexEmail)]),
      username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    });

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      console.log("validate user");
      this.validateUser(); // validate and navigate to role profile page
    }
  }

  get getEmailaddress(): AbstractControl  { return this.registerForm.get('emailaddress')!; }
  get getUsername(): AbstractControl { return this.registerForm.get('username')!; }
  get getPassword(): AbstractControl  { return this.registerForm.get('password')!; }
  get getConfirmPassword(): AbstractControl  { return this.registerForm.get('confirmPassword')!; }

  sendRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true; // Start the loading spinner
      this.authService
        .register(this.registerForm.value)
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
            this.registerError = '';
            this.registerForm.reset();
            this.navigateDashboard(res.user.role);
            AlertMessage.addSuccessAlert("Account registration is successfull !");
          },
          error: (err: any) => {
            this.registerError = err.error.message;
            console.error('Login Error:', err);
            AlertMessage.addErrorAlert(err.error.message);
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
          this.registerError = err.error.message;
          console.error('Token validation Error:', err);
          AlertMessage.addErrorAlert(err.error.message);
        },
      });
  }

  navigateDashboard(role: string): void {
    const dashboardRoute =
      role === 'admin' ? '/account/admin-profile' : '/account/profile';
    this.router.navigate([dashboardRoute]);
    console.log(`${role} dashboard route`);
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
