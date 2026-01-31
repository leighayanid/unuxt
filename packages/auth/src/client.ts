import { createAuthClient } from "better-auth/vue";
import { organizationClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";

export type AuthClient = ReturnType<typeof createAuthClient>;

export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL: `${baseURL}/api/auth`,
    plugins: [organizationClient(), twoFactorClient(), magicLinkClient()],
  });
}
