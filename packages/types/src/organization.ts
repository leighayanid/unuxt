export type OrganizationRole = "owner" | "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  createdAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expiresAt: Date;
  invitedById: string;
  createdAt: Date;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  logo?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  logo?: string;
}

export interface InviteMemberInput {
  email: string;
  role: OrganizationRole;
}
