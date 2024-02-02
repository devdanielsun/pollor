import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

interface Alert {
	type: string;
	message: string;
}

const ALERTS: Alert[] = [
	// {
	// 	type: 'info',
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
export class AlertMessage {
	static alerts: Alert[] = ALERTS;

    constructor() {
        this.reset();
    }

	close(alert: Alert) {
		AlertMessage.alerts.splice(AlertMessage.alerts.indexOf(alert), 1);
	}

    reset() {
		AlertMessage.alerts = [];
	}

    static addAlert(alertType: string, alertMessage: string, timeout: number = 10000) {
        const newAlert : Alert = {
            type: alertType,
            message: alertMessage
        };

		AlertMessage.alerts.unshift(newAlert);

        setTimeout(() => {
            AlertMessage.alerts.splice(AlertMessage.alerts.indexOf(newAlert), 1);
         }, timeout); // automatic close the alert after x miliseconds based
	}

    static addErrorAlert(alertMessage: string) {
        AlertMessage.addAlert("danger", "<b>An error occured:</b><br />" + alertMessage);
	}

    getAlertMessages() {
        return AlertMessage.alerts;
    }
}
