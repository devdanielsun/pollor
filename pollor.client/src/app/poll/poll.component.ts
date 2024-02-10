import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { IPoll } from '../_interfaces/poll.interface';
import { ApiService } from '../_api/api.service';
import { AlertMessage } from '../alert-message/alert-message';
import { VoteService } from '../_services/vote.service';
import { IpService } from '../_services/ip.service';
import { ICreateVote } from '../_interfaces/vote.interface';
import { IAnswer } from '../_interfaces/answer.interface';

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

  public voteCastLoading: boolean = false;
  public voteMsg: string = "";

  constructor(
    private apiService: ApiService,
    private alertMessage: AlertMessage,
    private route: ActivatedRoute,
    private voteService: VoteService,
    private ipService: IpService
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

  castVote(answer: IAnswer) {
    this.voteCastLoading = true;

    // Example usage
    this.ipService.getIPv4Address().subscribe({
      next: (response) => {
        const ipv4 = response;
        this.ipService.getIPv6Address().subscribe({
          next: (response) => {
            const ipv6 = response;
            this.sendVote(answer, ipv4, ipv6);
          },
          error: (error) => {
            this.voteMsg = "Failed to get ipv6, try again.";
            console.error(error.error);
            this.alertMessage.addErrorAlert("Failed to get ipv6", error.error);
          }
        });
      },
      error: (error) => {
        this.voteMsg = "Failed to get ipv4, try again.";
        console.error(error.error);
        this.alertMessage.addErrorAlert("Failed to get ipv4", error.error);
      }
    });
  }

  private sendVote(answer: IAnswer, ipv4: ArrayBuffer, ipv6: ArrayBuffer) {
    const macAddress = this.ipService.getMacAddress();

    const vote: ICreateVote = {
      answer_id: answer,
      ipv4_address: ipv4,
      ipv6_address: ipv6,
      mac_address: new ArrayBuffer(8)
    };

    console.log(vote);

    // Send the vote to the server
    /*this.voteService.castVote(vote).subscribe({
      next: (response) => {
        console.log(response);
        this.voteMsg = "Vote was successfull !"
        this.voteCastLoading = false;

        // reload page, so that cast vote buttons will be grayed out as anonymous user has voted
      },
      error: (error) => {
        console.error(error);
        const msg = ((error.error && error.error.message) ? error.error.message : error.message);
        this.voteMsg = error.status + ' - ' + msg;
        console.error('Cast Vote Error:', error);
        this.alertMessage.addErrorAlert("Cast Vote Error", msg);
        this.voteCastLoading = false;
      },
      //complete: () => {}
    });*/
  }
}
