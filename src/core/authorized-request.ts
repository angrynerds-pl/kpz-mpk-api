import { Request, RequestAuth, AuthCredentials } from "@hapi/hapi";

export interface AuthorizedCredentials extends AuthCredentials {
  customerId: string;
}

interface AuthorizedAuth extends RequestAuth {
  credentials: AuthorizedCredentials;
}

export interface AuthorizedRequest extends Request {
  auth: AuthorizedAuth;
}
