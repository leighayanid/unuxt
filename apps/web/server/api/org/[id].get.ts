import { auth } from "@unuxt/auth/server";
import { db } from "@unuxt/db";
import { organizations, members, invitations, users } from "@unuxt/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, "id");

  if (!orgId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }

  // Verify session
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  // Fetch organization
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, orgId),
  });

  if (!organization) {
    throw createError({
      statusCode: 404,
      message: "Organization not found",
    });
  }

  // Check if user is a member of the organization
  const userMember = await db.query.members.findFirst({
    where: and(eq(members.organizationId, orgId), eq(members.userId, session.user.id)),
  });

  if (!userMember) {
    throw createError({
      statusCode: 403,
      message: "You are not a member of this organization",
    });
  }

  // Fetch all members with user details
  const orgMembers = await db
    .select({
      id: members.id,
      userId: members.userId,
      role: members.role,
      createdAt: members.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
    })
    .from(members)
    .leftJoin(users, eq(members.userId, users.id))
    .where(eq(members.organizationId, orgId));

  // Fetch pending invitations (only for admins/owners)
  let orgInvitations: any[] = [];
  if (["owner", "admin"].includes(userMember.role)) {
    orgInvitations = await db
      .select()
      .from(invitations)
      .where(and(eq(invitations.organizationId, orgId), eq(invitations.status, "pending")));
  }

  return {
    organization,
    members: orgMembers,
    invitations: orgInvitations,
  };
});
