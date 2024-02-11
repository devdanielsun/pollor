import { Component } from '@angular/core';
import { ApiService } from '../_api/api.service';
import { IPoll } from '../_interfaces/poll.interface';
import { AlertMessage } from '../alert-message/alert-message';

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
    private alertMessage: AlertMessage
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
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = (seconds >= 60 || seconds <= -60) ? Math.floor(seconds / 60) : 0;
    let hours = (minutes >= 60 || minutes <= -60) ? Math.floor(minutes / 60) : 0;
    let days = (hours >= 24 || hours <= -24) ? Math.floor(hours / 24) : 0;
    let years = (days >= 365 || days <= -365)? Math.floor( days / 365) : 0;

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 365;

    let makeStr: string = '';

    if (years < 0 || days < 0 || hours < 0 || minutes < 0) {
      makeStr = "Poll is closed";

      if (years < 0) makeStr += ` ${this.padTo2Digits(years)} years ago.`;
      else if (days < 0) makeStr += ` ${this.padTo2Digits(days)} days ago.`;
      else if (hours < 0) makeStr += ` ${this.padTo2Digits(hours)} hours ago.`;
      else if (minutes < 0) makeStr += ` ${this.padTo2Digits(minutes)} minutes ago.`;

    } else {
      makeStr = "Poll open for ";

      if (years != 0) {
        makeStr += `${years} years, `;
        (days == 0 && hours == 0 && minutes == 0) ? makeStr += '.' : makeStr += ', ';
      }
      if (days != 0) {
        makeStr += `${days} days`;
        (hours == 0 && minutes == 0) ? makeStr += '.' : makeStr += ', ';
      }
      if (hours != 0) {
        makeStr += `${hours} hours`;
        minutes == 0 ? makeStr += '.' : makeStr += ', ';
      }
      if (minutes != 0) makeStr += `and ${minutes} minutes.`;
    }

    return makeStr;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  mouseEnter(pollId: string) {
    this.displayStyle.set(pollId, "block");
  }

  mouseLeave(pollId: string) {
    this.displayStyle.set(pollId, "none");
  }
}
