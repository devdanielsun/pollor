import { Component } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public appVersion: String = environment.appVersion;

  public githubUrl: String = "https://github.com/devdanielsun/pollor";
  public linkedinUrl: String = "https://www.linkedin.com/in/danielgeerts/";

}
