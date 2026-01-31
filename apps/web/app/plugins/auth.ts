import { createClient, type AuthClient } from "@unuxt/auth/client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authClient = createClient(config.public.betterAuthUrl);

  return {
    provide: {
      authClient,
    },
  };
});

declare module "#app" {
  interface NuxtApp {
    $authClient: AuthClient;
  }
}
