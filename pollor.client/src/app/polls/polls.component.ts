import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPolls } from '../../interfaces/polls.interface';

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

  constructor(private apiService: ApiService) { }

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
          this.pollLoadingMsg = err.status + ' - ' + err.message;
          this.pollLoadingColor = "red";
          console.error(err);
          AlertMessage.addErrorAlert(err.error.message);
        },
        //complete: () => { }
      });
  }
}
