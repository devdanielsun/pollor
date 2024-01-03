import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { environment } from '../environments/environment';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public appVersion: String = environment.appVersion;
  public baseApiUrl: String = this.apiService.getBaseUrl();
  public forecasts: WeatherForecast[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.apiService.get<WeatherForecast[]>('weatherforecast')
      .subscribe({
        next: (response) => this.forecasts = response,
        error: (error) => console.error(error),
        //complete: () => { }
      });
  }

  title = 'pollor.client';
}
