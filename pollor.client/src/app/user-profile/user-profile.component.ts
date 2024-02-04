import { Component } from '@angular/core';
import { IUser } from '../_interfaces/user.interface';
import { ApiService } from '../_api/api.service';
import { AlertMessage } from '../alert-message/alert-message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  public user: IUser = {
      id: 0,
      username: '',
      emailaddress: '',
      first_name: '',
      last_name: '',
      role: '',
      created_at: new Date(),
      polls: []
  };

  public userLoaded: boolean = false;
  public userLoadingMsg: string = "Loading polls...";
  public profileEditError: string = '';
  public editUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private alertMessage: AlertMessage
  ) {
    this.editUserForm = this.formBuilder.group({
      username: ["", Validators.required],
      emailaddress: ["", Validators.required],
      first_name: ["", Validators.required],
      last_name: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.apiService.get<IUser>('api/user')
      .subscribe({
        next: (response) => {
          this.user = response;
          this.userLoaded = true;
        },
        error: (err) => {
          const msg = ((err.error && err.error.message) ? err.error.message : err.message);
          this.userLoadingMsg = err.status + ' - ' + msg;
          console.error(err);
          this.alertMessage.addErrorAlert("Error loading User", msg);
        },
        //complete: () => { }
      });
  }

  editUser() {

  }
}
