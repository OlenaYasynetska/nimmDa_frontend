export interface StoredAuthAccount {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

export type AuthMailType = 'verify' | 'reset';

export interface StoredAuthToken {
  token: string;
  email: string;
  type: AuthMailType;
  expiresAt: number;
}

export interface LastAuthMail {
  email: string;
  type: AuthMailType;
  url: string;
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
