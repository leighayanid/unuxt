import { createAuthClient } from "better-auth/vue";
import { organizationClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  plugins: [organizationClient(), twoFactorClient(), magicLinkClient()],
});

// Export individual methods for easier usage
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  organization,
  twoFactor,
  magicLink,
} = authClient;
