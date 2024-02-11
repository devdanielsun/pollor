export interface IVote {
  id: number;
  answer_id: number;
  ipv4_address: string;
  ipv6_address: string;
  mac_address: string;
  voted_at: Date;
  created_at: Date;
}

export interface ICreateVote {
  answer_id: number;
  ipv4_address: string | null| undefined;
  ipv6_address: string | null | undefined;
  mac_address: string | null | undefined ;
}
