import { IAnswer, ICreateAnswer } from "./answers.interface";

export interface IPoll {
  id: string;
  user_id: number;
  question: number;
  ending_date: Date;
  created_at: Date;
  answers: IAnswer[];
}

export interface ICreatePoll {
  question: number;
  ending_date: Date;
  answers: ICreateAnswer[];
}
