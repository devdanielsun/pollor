import { IAnswer } from "./answer.interface";

export interface IVote {
  id: string;
  answer_id: IAnswer;
  ipv4_address: ArrayBuffer;
  ipv6_address: ArrayBuffer;
  mac_address: ArrayBuffer;
  voted_at: Date;
  created_at: Date;
}

export interface ICreateVote {
  answer_id: IAnswer;
  ipv4_address: ArrayBuffer;
  ipv6_address: ArrayBuffer;
  mac_address: ArrayBuffer;
}
