import { IPoll } from "./poll.interface";
import { IVote } from "./vote.interface";

export interface IAnswer {
  id: number;
  poll_id: IPoll;
  poll_answer: string;
  created_at: Date;
  votes: IVote[];
}

export interface ICreateAnswer {
  poll_answer: string;
}
