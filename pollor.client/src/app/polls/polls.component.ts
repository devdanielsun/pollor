import { Component } from '@angular/core';
import { ApiService } from '../_api/api.service';
import { IPolls } from '../_interfaces/polls.interface';

import { AlertMessage } from '../alert-message/alert-message';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrl: './polls.component.css'
})
export class PollsComponent {
  public polls: IPolls[] = [];

  public pollsLoaded: boolean = false;
  public pollLoadingMsg: string = "Loading polls...";
  public pollLoadingColor: string = "";

  constructor(
    private apiService: ApiService,
    private alertMessage: AlertMessage
  ) { }

  ngOnInit() {
    this.getPolls();
  }

  getPolls() {
    this.apiService.get<IPolls[]>('api/polls')
      .subscribe({
        next: (response) => {
          this.polls = response;
          this.pollsLoaded = true;
        },
        error: (err) => {
          const msg = ((err.error && err.error.message) ? err.error.message : err.message);
          this.pollLoadingMsg = err.status + ' - ' + msg;
          this.pollLoadingColor = "red";
          console.error(err);
          this.alertMessage.addInfoAlert("Cannot fetch polls", msg);
        },
        //complete: () => { }
      });
  }
}
