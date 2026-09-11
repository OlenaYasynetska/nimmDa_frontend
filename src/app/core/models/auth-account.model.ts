export type AuthMailType = 'verify' | 'reset';

export interface LastAuthMail {
  email: string;
  type: AuthMailType;
  mailSent: boolean;
}

export type AuthFlowError =
  | 'exists'
  | 'invalid'
  | 'notFound'
  | 'unverified'
  | 'expired'
  | 'mismatch'
  | 'mailFailed'
  | 'network';
