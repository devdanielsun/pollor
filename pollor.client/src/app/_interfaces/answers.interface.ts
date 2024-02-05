import { IPoll } from "./polls.interface";
import { IVote } from "./votes.interface";

export interface IAnswer {
  id: string;
  poll_id: IPoll;
  poll_answer: string;
  created_at: Date;
  votes: IVote[];
}

export interface ICreateAnswer {
  poll_answer: string;
}
