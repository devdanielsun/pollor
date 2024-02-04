import { IAnswers } from "./answers.interface";

export interface IVotes {
  id: string;
  answer_id: IAnswers;
  ipv4_address: Blob;
  ipv6_address: Blob;
  mac_address: Blob;
  voted_at: Date;
  created_at: Date;
}
