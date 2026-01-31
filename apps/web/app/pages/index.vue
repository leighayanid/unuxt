<script setup lang="ts">
const { isAuthenticated } = useAuth();

useSeoMeta({
  title: "Unuxt - Universal Nuxt 4 Starter",
  description: "A production-ready Nuxt 4 starter template with authentication, organizations, and more.",
});
</script>

<template>
  <div class="min-h-[calc(100vh-var(--app-header-height))]">
    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="container mx-auto max-w-4xl text-center">
        <h1 class="text-5xl font-bold mb-6">
          Universal Nuxt 4 Starter
        </h1>
        <p class="text-xl text-muted mb-8 max-w-2xl mx-auto">
          A production-ready template with authentication, organizations, profiles, and theme management. Built with Nuxt 4, Nuxt UI, and Better Auth.
        </p>
        <div class="flex items-center justify-center gap-4">
          <UButton v-if="!isAuthenticated" to="/auth/register" size="lg">
            Get Started
          </UButton>
          <UButton v-if="!isAuthenticated" to="/auth/login" size="lg" variant="outline">
            Sign In
          </UButton>
          <UButton v-if="isAuthenticated" to="/dashboard" size="lg">
            Go to Dashboard
          </UButton>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-muted">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-shield-check" class="text-2xl text-primary" />
                <h3 class="font-semibold">Authentication</h3>
              </div>
            </template>
            <p class="text-muted">
              Email/password, OAuth, magic links, and 2FA with Better Auth.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-users" class="text-2xl text-primary" />
                <h3 class="font-semibold">Organizations</h3>
              </div>
            </template>
            <p class="text-muted">
              Multi-tenant support with roles and permissions per organization.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-palette" class="text-2xl text-primary" />
                <h3 class="font-semibold">Theming</h3>
              </div>
            </template>
            <p class="text-muted">
              Dark mode, custom colors, and persistent theme preferences.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-image" class="text-2xl text-primary" />
                <h3 class="font-semibold">Image Uploads</h3>
              </div>
            </template>
            <p class="text-muted">
              Secure image uploads with Cloudinary integration.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-database" class="text-2xl text-primary" />
                <h3 class="font-semibold">PostgreSQL</h3>
              </div>
            </template>
            <p class="text-muted">
              Type-safe database access with Drizzle ORM.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-container" class="text-2xl text-primary" />
                <h3 class="font-semibold">Docker Ready</h3>
              </div>
            </template>
            <p class="text-muted">
              Production-ready Docker configuration included.
            </p>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
