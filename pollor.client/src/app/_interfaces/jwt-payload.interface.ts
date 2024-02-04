export interface JwtPayload {
  userName: string;
  userId: string;
  userRole: string;
  exp: string;
  iss: string;
  aud: string;
}
