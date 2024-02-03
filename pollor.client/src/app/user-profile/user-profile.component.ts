import { Component } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { ApiService } from '../../services/api.service';
import { AlertMessage } from '../alert-message/alert-message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private apiService: ApiService
  ) {
    this.editUserForm = formBuilder.group({
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
          console.log(this.user);

          this.userLoaded = true;
        },
        error: (err) => {
          const msg = (err.error.message ? err.error.message : err.message);
          this.userLoadingMsg = err.status + ' - ' + msg;
          console.error(err);
          AlertMessage.addErrorAlert(msg);
        },
        //complete: () => { }
      });
  }

  editUser() {

  }
}
