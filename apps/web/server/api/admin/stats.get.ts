import { auth } from "@unuxt/auth/server";
import { db } from "@unuxt/db";
import { users, organizations, sessions } from "@unuxt/db/schema";
import { count } from "drizzle-orm";

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

  // Check admin role
  const currentUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, session.user.id),
  });

  if (currentUser?.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden - Admin access required",
    });
  }

  // Get counts
  const [usersCount] = await db.select({ count: count() }).from(users);
  const [orgsCount] = await db.select({ count: count() }).from(organizations);
  const [sessionsCount] = await db.select({ count: count() }).from(sessions);

  return {
    users: usersCount.count,
    organizations: orgsCount.count,
    sessions: sessionsCount.count,
  };
});
