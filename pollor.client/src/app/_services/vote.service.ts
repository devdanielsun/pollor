import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../_api/api.service';
import { ICreateVote } from '../_interfaces/vote.interface';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private apiService: ApiService) { }

  castVote(vote: ICreateVote): Observable<any> {
    return this.apiService.post('api/vote', vote);
  }
}
