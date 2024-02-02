import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPolls } from '../../interfaces/polls.interface';
import { IAnswers } from '../../interfaces/answers.interface';
import { IVotes } from '../../interfaces/votes.interface';


@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrl: './polls.component.css'
})
export class PollsComponent {
  public polls: IPolls[] = [];

  public pollsLoaded: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getPolls();
  }

  getPolls() {
    this.apiService.get<IPolls[]>('api/polls')
      .subscribe({
        next: (response) => {
          this.polls = response;
          this.pollsLoaded = true;
        },
        error: (error) => console.error(error),
        //complete: () => { }
      });
  }
}
