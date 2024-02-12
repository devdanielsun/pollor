import { Injectable } from '@angular/core';
import { min } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

public convertMsToDaysAndHours(milliseconds: number) {
    const datetime = this.milisecondsToDateTime(milliseconds);

    let makeStr: string = '';

    if (datetime.years < 0 || datetime.days < 0 || datetime.hours < 0 || datetime.minutes < 0) {
      makeStr = "Poll is closed";

      if (datetime.years < 0) makeStr += ` ${this.padTo2Digits(datetime.years)} years ago.`;
      else if (datetime.days < 0) makeStr += ` ${this.padTo2Digits(datetime.days)} days ago.`;
      else if (datetime.hours < 0) makeStr += ` ${this.padTo2Digits(datetime.hours)} hours ago.`;
      else if (datetime.minutes < 0) makeStr += ` ${this.padTo2Digits(datetime.minutes)} minutes ago.`;

    } else {
      makeStr = "Poll open for ";

      if (datetime.years != 0) {
        makeStr += `${datetime.years} years, `;
        (datetime.days == 0 && datetime.hours == 0 && datetime.minutes == 0) ? makeStr += '.' : makeStr += ', ';
      }
      if (datetime.days != 0) {
        makeStr += `${datetime.days} days`;
        (datetime.hours == 0 && datetime.minutes == 0) ? makeStr += '.' : makeStr += ', ';
      }
      if (datetime.hours != 0) {
        makeStr += `${datetime.hours} hours`;
        datetime.minutes == 0 ? makeStr += '.' : makeStr += ', ';
      }
      
      makeStr += `and ${datetime.minutes} minutes.`;
    }

    return makeStr;
  }

  private milisecondsToDateTime(milliseconds: number): IDateTime {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = (seconds >= 60 || seconds <= -60) ? Math.floor(seconds / 60) : 0;
    let hours = (minutes > 60 || minutes < -60) ? Math.floor(minutes / 60) : 0;
    let days = (hours >= 24 || hours <= -24) ? Math.floor(hours / 24) : 0;
    let years = (days >= 365 || days <= -365)? Math.floor( days / 365) : 0;

    if (seconds < 60) minutes += 1; // past
    if (seconds > -60) minutes += 1; // future

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 365;

    return {
        minutes: minutes,
        hours: hours,
        days: days,
        years: years
    };
  }

  private  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}

export interface IDateTime {
    minutes: number;
    hours: number;
    days: number;
    years: number;
}

  