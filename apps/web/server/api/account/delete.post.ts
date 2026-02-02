import { auth } from "@unuxt/auth/server";
import { db } from "@unuxt/db";
import {
  users,
  sessions,
  accounts,
  twoFactors,
  members,
  invitations,
  organizations,
} from "@unuxt/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
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

  const body = await readBody(event);
  const { password } = body;

  if (!password) {
    throw createError({
      statusCode: 400,
      message: "Password is required",
    });
  }

  // Verify password by attempting to sign in
  try {
    const signInResult = await auth.api.signInEmail({
      body: {
        email: session.user.email,
        password,
      },
    });

    if (!signInResult) {
      throw createError({
        statusCode: 401,
        message: "Invalid password",
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: "Invalid password",
    });
  }

  const userId = session.user.id;

  // Delete user data in a transaction
  await db.transaction(async (tx) => {
    // Find organizations where user is the only owner
    const userOwnedOrgs = await tx
      .select({ organizationId: members.organizationId })
      .from(members)
      .where(and(eq(members.userId, userId), eq(members.role, "owner")));

    for (const { organizationId } of userOwnedOrgs) {
      // Check if there are other owners
      const otherOwners = await tx
        .select()
        .from(members)
        .where(
          and(
            eq(members.organizationId, organizationId),
            eq(members.role, "owner")
          )
        );

      // If user is the only owner, delete the organization (cascades to members, invitations)
      if (otherOwners.length === 1) {
        await tx.delete(organizations).where(eq(organizations.id, organizationId));
      }
    }

    // Delete memberships (where user is not owner, cascaded above)
    await tx.delete(members).where(eq(members.userId, userId));

    // Delete invitations created by this user
    await tx.delete(invitations).where(eq(invitations.inviterId, userId));

    // Delete 2FA data
    await tx.delete(twoFactors).where(eq(twoFactors.userId, userId));

    // Delete accounts (social logins, password)
    await tx.delete(accounts).where(eq(accounts.userId, userId));

    // Delete sessions
    await tx.delete(sessions).where(eq(sessions.userId, userId));

    // Finally, delete the user
    await tx.delete(users).where(eq(users.id, userId));
  });

  return { success: true };
});
