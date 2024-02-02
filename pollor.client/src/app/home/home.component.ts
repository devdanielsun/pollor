import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  public baseApiUrl: String = this.apiService.getBaseUrl();

  constructor(private apiService: ApiService) { }
}
