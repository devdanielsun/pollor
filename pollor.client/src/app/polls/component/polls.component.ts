import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPolls } from '../polls.interface';
import { IAnswers } from '../answers.interface';
import { IVotes } from '../votes.interface';


@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrl: './polls.component.css'
})
export class PollsComponent {
  public polls: IPolls[] = [];
  public answers: IAnswers[] = [];
  public votes: IVotes[] = [];

  public pollsLoaded: boolean = false;
  public answersLoaded: boolean = false;
  public votesLoaded: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getPolls();
    this.getAnswers();
    this.getVotes();
  }

  getPolls() {
    this.apiService.get<IPolls[]>('polls')
      .subscribe({
        next: (response) => {
          this.polls = response;
          this.pollsLoaded = true;
        },
        error: (error) => console.error(error),
        //complete: () => { }
      });
  }

  getAnswers() {
    this.apiService.get<IAnswers[]>('answers')
      .subscribe({
        next: (response) => {
          this.answers = response;
          this.answersLoaded = true;
        },
        error: (error) => console.error(error),
        //complete: () => { }
      });
  }

  getVotes() {
    this.apiService.get<IVotes[]>('votes')
      .subscribe({
        next: (response) => {
          this.votes = response;
          this.votesLoaded = true;
        },
        error: (error) => console.error(error),
        //complete: () => { }
      });
  }
}