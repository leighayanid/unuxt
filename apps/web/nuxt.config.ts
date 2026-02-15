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
    "nuxt-security",
    ...(process.env.CLOUDINARY_CLOUD_NAME ? ["@nuxtjs/cloudinary"] : []),
  ],

  css: ["~/assets/css/main.css"],

  // Security configuration
  security: {
    headers: {
      // Security headers
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com", // Cloudinary images
        ],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"], // unsafe-inline needed for Nuxt UI
        "script-src": [
          "'self'",
          "https:",
          "'unsafe-inline'", // Required for Nuxt hydration
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
        ],
        "upgrade-insecure-requests": true,
      },
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === "development" ? "unsafe-none" : "require-corp",
      crossOriginOpenerPolicy:
        process.env.NODE_ENV === "development"
          ? "same-origin-allow-popups"
          : "same-origin",
      crossOriginResourcePolicy: "same-origin",
      originAgentCluster: "?1",
      referrerPolicy: "no-referrer",
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
      xContentTypeOptions: "nosniff",
      xDNSPrefetchControl: "off",
      xDownloadOptions: "noopen",
      xFrameOptions: "SAMEORIGIN",
      xPermittedCrossDomainPolicies: "none",
      xXSSProtection: "1; mode=block",
      permissionsPolicy: {
        camera: ["()"],
        "display-capture": ["()"],
        fullscreen: ["()"],
        geolocation: ["()"],
        microphone: ["()"],
      },
    },
    // CSRF protection
    csrf: {
      enabled: true,
      methodsToProtect: ["POST", "PUT", "PATCH", "DELETE"],
      // Exclude Better Auth endpoints (they have their own CSRF protection)
      excludedUrls: ["/api/auth/**"],
    },
    // Rate limiting
    rateLimiter: {
      enabled: true,
      tokensPerInterval: 150,
      interval: 60000, // 1 minute
      fireImmediately: false,
      throwError: true,
    },
    // Allowed HTTP methods
    allowedMethodsRestricter: {
      methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
      throwError: true,
    },
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // CORS (adjust for your needs)
    corsHandler: {
      origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflight: {
        statusCode: 204,
      },
    },
  },

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
    fromName: process.env.FROM_NAME,
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
