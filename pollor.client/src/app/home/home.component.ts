import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  public baseApiUrl: String = this.apiService.getBaseUrl();
  public forecasts: WeatherForecast[] = [];

  constructor(private apiService: ApiService) { }

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
}
