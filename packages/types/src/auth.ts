import type { User } from "./user";
import type { Organization, OrganizationMember } from "./organization";

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface AuthSession {
  user: User;
  session: Session;
}

export interface AuthContext {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  activeOrganization: Organization | null;
  membership: OrganizationMember | null;
}

export type OAuthProvider = "google" | "github";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}
