import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IPoll } from '../_interfaces/poll.interface';
import { ApiService } from '../_api/api.service';
import { AlertMessage } from '../alert-message/alert-message';
import { VoteService } from '../_services/vote.service';
import { IpService } from '../_services/ip.service';
import { ICreateVote, IVote } from '../_interfaces/vote.interface';
import { IAnswer } from '../_interfaces/answer.interface';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {

  public poll: IPoll | null | undefined;
  private pollId: string | undefined;

  public pollLoaded: boolean = false;
  public pollLoadingMsg: string = "Loading poll...";
  public pollLoadingColor: string = "";

  public pollHasEnded: boolean = false;

  public voteCastLoading: boolean = false;
  public voteCastSuccess: boolean = false;
  public voteMsg: string = "";
  private voteSucessMsg: string = "Your vote has been received, thank you for voting!";

  public alreadyVoted: boolean = false;

  private ipv4: string | null = null;
  private ipv6: string | null = null
  private ipv4Loaded:boolean = false;
  private ipv6Loaded:boolean = false;

  private getPollCallbackFunction: (() => void) | undefined = undefined;
  private sendVoteCallbackFunction: ((answer: number) => void)  | undefined = undefined;

  constructor(
    private apiService: ApiService,
    private alertMessage: AlertMessage,
    private router: Router,
    private route: ActivatedRoute,
    private voteService: VoteService,
    private ipService: IpService
  ) { }

  ngOnInit() {
    this.pollId = this.route.snapshot.paramMap.get('id')!;

    this.getPollCallbackFunction = this.getPoll;
    this.getIpv4();
    this.getIpv6();
  }

  getPoll() {
    this.apiService.get<IPoll>(`api/poll/${ this.pollId }`)
      .subscribe({
        next: (response) => {
          this.poll = response;

          this.poll.answers.forEach((a: IAnswer) => {
            a.votes.forEach((v: IVote) => {
              if (v.ipv4_address == this.ipv4 || v.ipv6_address == this.ipv6) {
                this.alreadyVoted = true;
                this.voteMsg = this.voteSucessMsg + ` You have voted on <i><b>${ a.poll_answer }</b></i>`;
              }
            });
          });

          this.poll.ending_date = new Date(this.poll.ending_date);
          this.pollLoaded = true;
          this.pollHasEnded = this.poll.ending_date.getTime() < Date.now();

          if (!this.alreadyVoted && this.pollHasEnded) {
            this.voteMsg = `You missed this poll.`;
          }

        },
        error: (err) => {
          const msg = ((err.error && err.error.message) ? err.error.message : (err.error.title) ? err.error.title : err.message);
          this.pollLoadingMsg = err.status + ' - ' + msg;
          this.pollLoadingColor = "red";
          console.error(err);
          this.alertMessage.addInfoAlert("Cannot fetch polls", msg);
        },
        //complete: () => { }
      });
  }

  castVote(answer: number) {
    this.voteCastLoading = true;
    this.voteMsg = "Vote uploading..."

    this.sendVoteCallbackFunction = this.sendVote;
    this.getIpv4(answer);
    this.getIpv6(answer);
  }

  private getIpv4(answer: number | null = null) {
    if (!this.ipv4Loaded) {
      this.ipService.getIPv4Address().subscribe({
        next: (response) => {
          this.ipv4 = response;
          this.ipv4Loaded = true;
          this.handleCallback(answer);
        },
        error: (error) => {
          this.ipv4Loaded = true;
          console.error(error.error);
          //this.alertMessage.addErrorAlert("Failed to get ipv4", error.error);
          this.handleCallback(answer);
        }
      });
    } else {
      this.handleCallback(answer);
    }
  }

  private getIpv6(answer: number | null = null) {
    // Example usage
    if (!this.ipv6Loaded) {
      this.ipService.getIPv6Address().subscribe({
        next: (response) => {
          this.ipv6 = response;
          this.ipv6Loaded = true;
          this.handleCallback(answer);
        },
        error: (error) => {
          this.ipv6Loaded = true;
          console.error(error.error);
          //this.alertMessage.addErrorAlert("Failed to get ipv6", error.error);
          this.handleCallback(answer);
        }
      });
    } else {
      this.handleCallback(answer);
    }
  }

  private handleCallback(answer: number | null = null) {
    // console.log(`ipv4: ${this.ipv4Loaded}`);
    // console.log(`ipv6: ${this.ipv6Loaded}`);

    if (this.ipv4Loaded && this.ipv6Loaded) {
      if (this.getPollCallbackFunction) {
        this.getPollCallbackFunction();
        this.getPollCallbackFunction = undefined;
      } else if (this.sendVoteCallbackFunction && answer) {
        this.sendVoteCallbackFunction(answer);
        this.sendVoteCallbackFunction = undefined;
      }
    }
  }

  private sendVote(answer: number) {
    let vote: ICreateVote = {
      answer_id: answer,
      ipv4_address: undefined,
      ipv6_address: undefined,
      mac_address: undefined
    };

    if (this.ipv4 || this.ipv6) {    
      if (this.ipv4) vote.ipv4_address = this.ipv4;
      if (this.ipv6) vote.ipv6_address = this.ipv6;
    } else {
      this.voteMsg = "Failed to get IP Address, try again.";
      this.alertMessage.addErrorAlert("Failed to get IP Address", `Ipv4(${ this.ipv4 }) and ipv6 (${ this.ipv6 })`);
    }

    // Send the vote to the server
    this.voteService.castVote(vote).subscribe({
      next: (response) => {
        this.voteMsg = this.voteSucessMsg;
        this.voteCastLoading = false;
        this.voteCastSuccess = true;
        // reload page, so that cast vote buttons will be grayed out as anonymous user has voted
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
      error: (err) => {
        console.error(err);
        const msg = ((err.error && err.error.message) ? err.error.message : (err.error.title) ? err.error.title : err.message);
        this.voteMsg = err.status + ' - ' + msg;
        console.error('Cast Vote Error:', err);
        this.alertMessage.addErrorAlert("Cast Vote Error", msg);
        this.voteCastLoading = false;
        this.voteCastSuccess = false;
      },
      //complete: () => {}
    });
  }
}
