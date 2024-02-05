import { IPoll } from "./polls.interface";

export interface IUser {
  id: number;
  username: string;
  emailaddress: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: Date;
  polls: IPoll[];
}

export interface IUserChangePassword {
  id: number;
  username: string;
  password: string;
  confirm_password: string;
}
