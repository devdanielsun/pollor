import { IPolls } from "./polls.interface";
import { IVotes } from "./votes.interface";

export interface IAnswers{
  id: string;
  poll_id: IPolls;
  poll_answer: string;
  created_at: Date;
  votes: IVotes[];
}
