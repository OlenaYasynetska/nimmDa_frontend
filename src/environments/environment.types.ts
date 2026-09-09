/**
 * Shared environment shape (dev + production build).
 */
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  enableLocalSuperAdminLogin: boolean;
  superAdminEmail: string;
  superAdminPassword: string;
}
