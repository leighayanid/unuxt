import { auth } from "@unuxt/auth/server";
import { db } from "@unuxt/db";
import { users } from "@unuxt/db/schema";
import { desc } from "drizzle-orm";

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

  // Fetch all users
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      name: users.name,
      image: users.image,
      role: users.role,
      twoFactorEnabled: users.twoFactorEnabled,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return allUsers;
});
