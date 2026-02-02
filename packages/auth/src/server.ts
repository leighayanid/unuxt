import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@unuxt/db";
import * as schema from "@unuxt/db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users: schema.users,
      sessions: schema.sessions,
      accounts: schema.accounts,
      verifications: schema.verifications,
      twoFactors: schema.twoFactors,
      organizations: schema.organizations,
      members: schema.members,
      invitations: schema.invitations,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when email sending is implemented
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending with your SMTP provider
      console.log(`[AUTH] Reset password email for ${user.email}: ${url}`);
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending with your SMTP provider
      console.log(`[AUTH] Verification email for ${user.email}: ${url}`);
    },
    sendOnSignUp: false, // Set to true when email sending is implemented
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
    max: 100, // Increased for development, reduce in production
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

export type Auth = typeof auth;
