import { Component } from '@angular/core';
import { IPoll } from '../_interfaces/polls.interface';
import { ApiService } from '../_api/api.service';
import { HttpParams } from '@angular/common/http';
import { AlertMessage } from '../alert-message/alert-message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {

  public poll: IPoll | null | undefined;

  public pollLoaded: boolean = false;
  public pollLoadingMsg: string = "Loading poll...";
  public pollLoadingColor: string = "";

  constructor(
    private apiService: ApiService,
    private alertMessage: AlertMessage,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.getPoll(id);
  }

  getPoll(pollId: string) {
    HttpParams
    this.apiService.get<IPoll>(`api/poll/${ pollId }`)
      .subscribe({
        next: (response) => {
          this.poll = response;
          this.pollLoaded = true;
        },
        error: (err) => {
          const msg = ((err.error && err.error.message) ? err.error.message : err.message);
          this.pollLoadingMsg = err.status + ' - ' + msg;
          this.pollLoadingColor = "red";
          console.error(err);
          this.alertMessage.addInfoAlert("Cannot fetch polls", msg);
        },
        //complete: () => { }
      });
  }

  castVote() {

  }
}
