import { Component } from '@angular/core';
import { formatDate } from '@angular/common';

import { ApiService } from '../_api/api.service';
import { IPoll } from '../_interfaces/polls.interface';

import { AlertMessage } from '../alert-message/alert-message';
import { map } from 'rxjs';

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

          for (let i = 0; i < response.length; i++) { // convert SQL date to a Date to TypeScript understands
            response[i].ending_date = new Date(response[i].ending_date)
            response[i].created_at = new Date(response[i].created_at)
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
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 365;

    let makeStr: string = '';

    if (years < 0 || days < 0 || hours < 0 && minutes < 0) {
      makeStr = "Poll is closed";

      if (years < 0) {
        makeStr += ` ${this.padTo2Digits(years)} years ago.`;
      } else if (days < 0) {
        makeStr += ` ${this.padTo2Digits(days)} days ago.`;
      } else if (hours < 0) {
        makeStr += ` ${this.padTo2Digits(hours)} hours ago.`;
      } else if (minutes < 0) {
        makeStr += ` ${this.padTo2Digits(minutes)} minutes ago.`;
      }
    } else {
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
      if (minutes != 0) {
        makeStr += `and ${minutes} minutes.`;
      }
    }

    return makeStr;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
