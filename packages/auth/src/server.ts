import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@unuxt/db";

// Access control for organization roles
const organizationAccessControl = {
  owner: ["organization", "member", "invitation"],
  admin: ["member", "invitation"],
  member: [],
} as const;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log(`Reset password email for ${user.email}: ${url}`);
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log(`Verification email for ${user.email}: ${url}`);
    },
    sendOnSignUp: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ),
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      memberRole: "member",
      roles: {
        owner: {
          permissions: ["organization", "member", "invitation"],
        },
        admin: {
          permissions: ["member", "invitation"],
        },
        member: {
          permissions: [],
        },
      },
      sendInvitationEmail: async ({ email, organization, invitedBy, url }) => {
        // TODO: Implement email sending
        console.log(
          `Invitation email for ${email} to join ${organization.name}: ${url}`
        );
      },
    }),

    twoFactor({
      issuer: "Unuxt",
      otpOptions: {
        window: 1,
      },
    }),

    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // TODO: Implement email sending
        console.log(`Magic link for ${email}: ${url}`);
      },
      expiresIn: 60 * 15, // 15 minutes
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  rateLimit: {
    window: 60,
    max: 10,
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

export type Auth = typeof auth;
