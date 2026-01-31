import { db } from "./client";
import { users, organizations, members } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Create a demo user
  const [demoUser] = await db
    .insert(users)
    .values({
      email: "demo@example.com",
      name: "Demo User",
      emailVerified: true,
    })
    .returning();

  console.log("Created demo user:", demoUser?.email);

  // Create a demo organization
  const [demoOrg] = await db
    .insert(organizations)
    .values({
      name: "Demo Organization",
      slug: "demo-org",
    })
    .returning();

  console.log("Created demo organization:", demoOrg?.slug);

  // Add user as owner of the organization
  if (demoUser && demoOrg) {
    await db.insert(members).values({
      organizationId: demoOrg.id,
      userId: demoUser.id,
      role: "owner",
    });

    console.log("Added demo user as owner of demo organization");
  }

  console.log("Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
