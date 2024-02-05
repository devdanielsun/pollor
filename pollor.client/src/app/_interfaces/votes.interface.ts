import { IAnswer } from "./answers.interface";

export interface IVote {
  id: string;
  answer_id: IAnswer;
  ipv4_address: Blob;
  ipv6_address: Blob;
  mac_address: Blob;
  voted_at: Date;
  created_at: Date;
}

export interface ICreateVote {
  answer_id: IAnswer;
  ipv4_address: Blob;
  ipv6_address: Blob;
  mac_address: Blob;
}
