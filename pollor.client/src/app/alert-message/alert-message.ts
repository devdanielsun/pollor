import { Component, Injectable } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

interface Alert {
	type: string;
	title: string;
	message: string;
}

const ALERTS: Alert[] = [
	// {
	// 	type: 'info',
	//  title: 'Test alert',
	// 	message: 'This is an test alert',
	// }
];

@Component({
  selector: 'ngbd-alert-message',
  standalone: true,
  imports: [NgbAlertModule],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.css'

})
@Injectable({
  providedIn: 'root'
})
export class AlertMessage {
  alerts: Alert[] = ALERTS;

  constructor() {
    //this.reset();
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  reset() {
    this.alerts = [];
  }

  addAlert(alertType: string, alertTitle: string, alertMessage: string, timeout: number = 10000) {
    const newAlert: Alert = {
      type: alertType,
      title: alertTitle,
      message: alertMessage
    };

    this.alerts.unshift(newAlert);

    setTimeout(() => {
      this.alerts.splice(this.alerts.indexOf(newAlert), 1);
    }, timeout); // automatic close the alert after x miliseconds based
  }


  addSuccessAlert(alertTitle: string, alertMessage: string) {
    this.addAlert("success", alertTitle, alertMessage);
  }

  addInfoAlert(alertTitle: string, alertMessage: string) {
    this.addAlert("info", alertTitle, alertMessage);
  }

  addErrorAlert(alertTitle: string, alertMessage: string) {
    this.addAlert("danger", alertTitle, alertMessage);
  }

  getAlertMessages() {
    return this.alerts;
  }
}
