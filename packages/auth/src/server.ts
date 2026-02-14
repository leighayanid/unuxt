import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@unuxt/db";
import * as schema from "@unuxt/db/schema";
import {
  sendEmail,
  resetPasswordEmail,
  verifyEmailTemplate,
  magicLinkEmail,
  organizationInvitationEmail,
} from "@unuxt/email";

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
    requireEmailVerification: false, // Can be enabled now that email is implemented
    sendResetPassword: async ({ user, url }) => {
      try {
        const emailOptions = resetPasswordEmail({
          email: user.email,
          resetUrl: url,
          expiresInMinutes: 60,
        });
        await sendEmail(emailOptions);
        console.log(`[AUTH] Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error("[AUTH] Failed to send password reset email:", error);
        // Fallback to console in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[AUTH] Reset password URL: ${url}`);
        }
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const emailOptions = verifyEmailTemplate({
          email: user.email,
          verifyUrl: url,
        });
        await sendEmail(emailOptions);
        console.log(`[AUTH] Verification email sent to ${user.email}`);
      } catch (error) {
        console.error("[AUTH] Failed to send verification email:", error);
        // Fallback to console in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[AUTH] Verification URL: ${url}`);
        }
      }
    },
    sendOnSignUp: false, // Can be enabled when ready
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
      sendInvitationEmail: async ({ email, organization, invitedBy, url, invitation }) => {
        try {
          // Extract invitation ID and create custom frontend URL
          // Better Auth provides the invitation object with the ID
          const invitationId = invitation.id;
          const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
          const customInviteUrl = `${baseURL}/auth/accept-invite/${invitationId}`;

          const emailOptions = organizationInvitationEmail({
            email,
            organizationName: organization.name,
            invitedBy: invitedBy.name || invitedBy.email,
            inviteUrl: customInviteUrl,
            role: invitation.role || "member",
          });
          await sendEmail(emailOptions);
          console.log(`[AUTH] Invitation email sent to ${email} for ${organization.name}`);
        } catch (error) {
          console.error("[AUTH] Failed to send invitation email:", error);
          // Fallback to console in development
          if (process.env.NODE_ENV === "development") {
            console.log(`[AUTH] Invitation URL: ${url}`);
          }
        }
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
        try {
          const emailOptions = magicLinkEmail({
            email,
            magicUrl: url,
            expiresInMinutes: 15,
          });
          await sendEmail(emailOptions);
          console.log(`[AUTH] Magic link email sent to ${email}`);
        } catch (error) {
          console.error("[AUTH] Failed to send magic link email:", error);
          // Fallback to console in development
          if (process.env.NODE_ENV === "development") {
            console.log(`[AUTH] Magic link URL: ${url}`);
          }
        }
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
