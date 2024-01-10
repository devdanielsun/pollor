import { IPolls } from "./polls.interface";

export interface IAnswers{
  id: string;
  poll_id: IPolls;
  poll_answer: string;
}
