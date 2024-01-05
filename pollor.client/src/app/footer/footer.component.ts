import { Component } from '@angular/core';
import { environment } from './../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public appVersion: String = environment.appVersion;
  
  faLinkedin = faLinkedin
  faGithub = faGithub
}
