import { Component } from '@angular/core';
import { ApiService } from '../_api/api.service';
import { IPoll } from '../_interfaces/poll.interface';
import { AlertMessage } from '../alert-message/alert-message';
import { DatetimeService } from '../_services/datetime.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrl: './polls.component.css'
})
export class PollsComponent {
  public polls: IPoll[] = [];

  public pollsLoaded: boolean = false;
  public pollLoadingMsg: string = "Loading polls...";
  public pollLoadingColor: string = "";

  public currentDate: Date = new Date();
  public displayStyle: Map<string, string> = new Map<string, string>();

  constructor(
    private apiService: ApiService,
    private alertMessage: AlertMessage,
    private datetimeService: DatetimeService
  ) { }

  ngOnInit() {
    this.getPolls();
  }

  getPolls() {
    this.apiService.get<IPoll[]>('api/polls')
      .subscribe({
        next: (response: IPoll[]) => {
          // Edit received data
          for (let i = 0; i < response.length; i++) {
            // convert SQL date to a Date to TypeScript understands
            response[i].ending_date = new Date(response[i].ending_date);
            response[i].created_at = new Date(response[i].created_at);
            // set info popup to display none;
            this.displayStyle.set(response[i].id, "none");
          }

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

  datetimeToMiliseconds(datetime: Date): number {
    return datetime.getTime();
  }

  convertMsToDaysAndHours(milliseconds: number) {
    return this.datetimeService.convertMsToDaysAndHours(milliseconds);
  }

  mouseEnter(pollId: string) {
    this.displayStyle.set(pollId, "block");
  }

  mouseLeave(pollId: string) {
    this.displayStyle.set(pollId, "none");
  }
}
