import { Component } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AlertMessage } from '../alert-message/alert-message';
import { ApiService } from '../_api/api.service';

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
    private apiService: ApiService,
    private alertMessage: AlertMessage
  ) {
    this.registerForm = this.fb.group({
      emailaddress: new FormControl(null, [Validators.required, Validators.pattern(this.regexEmail)]),
      username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    });

    if (this.authService.isAuthenticated()) {
      this.validateUserAndRedirectToProfile(); // validate and navigate to role profile page
    }
  }

  get getEmailaddress(): AbstractControl  { return this.registerForm.get('emailaddress')!; }
  get getUsername(): AbstractControl { return this.registerForm.get('username')!; }
  get getPassword(): AbstractControl  { return this.registerForm.get('password')!; }
  get getConfirmPassword(): AbstractControl  { return this.registerForm.get('confirmPassword')!; }

  sendRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true; // Start the loading spinner
      this.apiService
        .register(this.registerForm.value)
        .pipe(
          finalize(() => {
            this.loading = false; //Stop the loading spinner
          })
        )
        .subscribe({
          next: (res: any) => {
            this.registerError = '';
            this.registerForm.reset();
            this.authService.setToken(res.token);
            this.authService.navigateDashboard();
            this.alertMessage.addSuccessAlert(`Welcome ${res.user.username} :)`, "Account registration is successfull !");
          },
          error: (err: any) => {
            const msg = ((err.error && err.error.message) ? err.error.message : err.message);
            this.registerError = err.status + ' - ' + msg;
            console.error('Registration Error:', err);
            this.alertMessage.addErrorAlert("Registration Error", msg);
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
          this.registerError = err.status + ' - ' + msg;
          console.error('Token validation Error:', err);
          this.alertMessage.addErrorAlert("Token validation Error", msg);
        },
      });
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
