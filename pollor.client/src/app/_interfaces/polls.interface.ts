import { IAnswers } from "./answers.interface";

export interface IPolls {
  id: string;
  user_id: number;
  question: number;
  ending_date: Date;
  created_at: Date;
  answers: IAnswers[];
}
