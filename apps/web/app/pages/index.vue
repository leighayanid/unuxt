<script setup lang="ts">
const { isAuthenticated } = useAuth();

useSeoMeta({
  title: "UNuxt - Universal Nuxt 4 Starter",
  description: "A production-ready Nuxt 4 starter template with authentication, organizations, and more.",
});

const features = [
  {
    title: "Authentication",
    description: "Email/password, OAuth, magic links, and 2FA powered by Better Auth.",
    icon: "i-lucide-shield-check",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Organizations",
    description: "Multi-tenant support with roles, permissions, and member invites.",
    icon: "i-lucide-users",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Dark Mode",
    description: "System-aware theming with smooth transitions and persistence.",
    icon: "i-lucide-moon",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Type-Safe DB",
    description: "PostgreSQL with Drizzle ORM for end-to-end type safety.",
    icon: "i-lucide-database",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    title: "File Uploads",
    description: "Cloudinary integration for avatars and media management.",
    icon: "i-lucide-cloud-upload",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    title: "Docker Ready",
    description: "Production-ready containers with multi-stage builds.",
    icon: "i-lucide-container",
    gradient: "from-rose-500/20 to-red-500/20",
  },
];

const techStack = [
  { label: "Nuxt 4", icon: "i-simple-icons-nuxtdotjs", color: "text-[#00DC82]" },
  { label: "Vue 3", icon: "i-simple-icons-vuedotjs", color: "text-[#4FC08D]" },
  { label: "TypeScript", icon: "i-simple-icons-typescript", color: "text-[#3178C6]" },
  { label: "Tailwind", icon: "i-simple-icons-tailwindcss", color: "text-[#06B6D4]" },
  { label: "PostgreSQL", icon: "i-simple-icons-postgresql", color: "text-[#4169E1]" },
  { label: "Drizzle", icon: "i-simple-icons-drizzle", color: "text-[#C5F74F]" },
];

const stats = [
  { value: "10+", label: "Pre-built pages" },
  { value: "100%", label: "TypeScript" },
  { value: "< 5min", label: "Setup time" },
  { value: "MIT", label: "License" },
];

const benefits = [
  {
    icon: "i-lucide-rocket",
    title: "Ship in Days",
    description: "Authentication, organizations, and user management ready out of the box.",
  },
  {
    icon: "i-lucide-blocks",
    title: "Modular Design",
    description: "Turborepo monorepo with shared packages for maximum code reuse.",
  },
  {
    icon: "i-lucide-sparkles",
    title: "Modern Stack",
    description: "Built with the latest Nuxt 4, Vue 3, and Tailwind CSS 4.",
  },
];
</script>

<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center">
      <!-- Animated Background -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] animate-pulse animation-delay-1000" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--ui-bg)_70%)]" />
      </div>

      <UContainer class="relative py-24 lg:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Badge -->
          <div class="animate-fade-in">
            <UBadge color="primary" variant="subtle" size="lg" class="mb-6">
              <UIcon name="i-lucide-sparkles" class="mr-1" />
              Built for Nuxt 4
            </UBadge>
          </div>

          <!-- Title -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in animation-delay-100">
            Ship your SaaS
            <span class="block text-primary">in record time</span>
          </h1>

          <!-- Description -->
          <p class="text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
            A production-ready Nuxt 4 starter with authentication, organizations,
            and everything you need to launch faster.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
            <template v-if="isAuthenticated">
              <UButton to="/dashboard" size="xl" class="min-w-[200px]">
                <UIcon name="i-lucide-layout-dashboard" class="mr-2" />
                Go to Dashboard
              </UButton>
            </template>
            <template v-else>
              <UButton to="/auth/register" size="xl" class="min-w-[200px]">
                Get Started Free
                <UIcon name="i-lucide-arrow-right" class="ml-2" />
              </UButton>
              <UButton to="/auth/login" size="xl" variant="outline" class="min-w-[200px]">
                Sign In
              </UButton>
            </template>
          </div>

          <!-- Tech Stack Pills -->
          <div class="flex flex-wrap items-center justify-center gap-3 mt-16 animate-fade-in animation-delay-500">
            <div
              v-for="tech in techStack"
              :key="tech.label"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-default/50 backdrop-blur-sm"
            >
              <UIcon :name="tech.icon" :class="['text-lg', tech.color]" />
              <span class="text-sm font-medium">{{ tech.label }}</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Stats Section -->
    <section class="border-y border-default bg-muted/30">
      <UContainer>
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-default">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="py-12 text-center"
          >
            <div class="text-3xl sm:text-4xl font-bold text-primary mb-2">{{ stat.value }}</div>
            <div class="text-sm text-muted">{{ stat.label }}</div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features Section -->
    <section class="py-24 lg:py-32">
      <UContainer>
        <div class="text-center mb-16">
          <UBadge color="primary" variant="subtle" class="mb-4">Features</UBadge>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need, nothing you don't
          </h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Pre-configured features that would take weeks to build from scratch.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group relative p-6 rounded-2xl border border-default bg-default/50 hover:bg-default hover:border-primary/30 transition-all duration-300"
          >
            <div :class="['absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', feature.gradient]" />
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <UIcon :name="feature.icon" class="text-2xl text-primary" />
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-muted text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Benefits Section -->
    <section class="py-24 lg:py-32 bg-muted/30">
      <UContainer>
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <UBadge color="primary" variant="subtle" class="mb-4">Why UNuxt?</UBadge>
            <h2 class="text-3xl sm:text-4xl font-bold mb-6">
              Focus on what makes your product unique
            </h2>
            <p class="text-lg text-muted mb-8">
              Stop rebuilding the same features for every project. UNuxt gives you a solid foundation so you can focus on building what matters.
            </p>

            <div class="space-y-6">
              <div
                v-for="benefit in benefits"
                :key="benefit.title"
                class="flex gap-4"
              >
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UIcon :name="benefit.icon" class="text-xl text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">{{ benefit.title }}</h3>
                  <p class="text-sm text-muted">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Code Preview Card -->
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
            <div class="relative rounded-2xl border border-default bg-default overflow-hidden shadow-2xl">
              <div class="flex items-center gap-2 px-4 py-3 border-b border-default bg-muted/50">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/80" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div class="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span class="text-xs text-muted ml-2">terminal</span>
              </div>
              <div class="p-6 font-mono text-sm">
                <div class="text-muted"># Clone the repository</div>
                <div class="mt-2">
                  <span class="text-green-500">$</span>
                  <span class="text-default"> git clone </span>
                  <span class="text-primary">https://github.com/unuxt/unuxt.git</span>
                </div>
                <div class="mt-4 text-muted"># Install dependencies</div>
                <div class="mt-2">
                  <span class="text-green-500">$</span>
                  <span class="text-default"> pnpm install</span>
                </div>
                <div class="mt-4 text-muted"># Start developing</div>
                <div class="mt-2">
                  <span class="text-green-500">$</span>
                  <span class="text-default"> pnpm dev</span>
                </div>
                <div class="mt-4 text-primary animate-pulse">Ready in ~3 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-24 lg:py-32 relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <UContainer>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to ship faster?
          </h2>
          <p class="text-xl text-muted mb-10">
            Join developers who are building their SaaS products with UNuxt.
            Start for free, no credit card required.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <template v-if="isAuthenticated">
              <UButton to="/dashboard" size="xl">
                Open Dashboard
                <UIcon name="i-lucide-arrow-right" class="ml-2" />
              </UButton>
            </template>
            <template v-else>
              <UButton to="/auth/register" size="xl">
                Start Building Now
                <UIcon name="i-lucide-arrow-right" class="ml-2" />
              </UButton>
              <UButton
                to="https://github.com/unuxt/unuxt"
                target="_blank"
                size="xl"
                variant="ghost"
              >
                <UIcon name="i-simple-icons-github" class="mr-2" />
                Star on GitHub
              </UButton>
            </template>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animation-delay-500 {
  animation-delay: 0.5s;
  opacity: 0;
}

.animation-delay-1000 {
  animation-delay: 1s;
}
</style>
