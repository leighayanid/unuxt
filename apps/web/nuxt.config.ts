export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-01-01",

  extends: ["@unuxt/ui"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    ...(process.env.CLOUDINARY_CLOUD_NAME ? ["@nuxtjs/cloudinary"] : []),
  ],

  css: ["~/assets/css/main.css"],

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "unuxt-color-mode",
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL,
    public: {
      betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    },
  },

  routeRules: {
    "/dashboard/**": { ssr: false },
    "/org/**": { ssr: false },
    "/admin/**": { ssr: false },
  },

  nitro: {
    preset: "node-server",
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  devtools: { enabled: true },
});
