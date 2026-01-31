<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth();

const navItems = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
];
</script>

<template>
  <header class="fixed top-0 left-0 right-0 h-[var(--app-header-height)] bg-default/80 backdrop-blur-sm border-b border-default z-50">
    <div class="container mx-auto h-full px-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="font-bold text-xl">
        Unuxt
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-muted hover:text-default transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <ThemeToggle />

        <template v-if="isAuthenticated">
          <UButton to="/dashboard" variant="ghost">
            Dashboard
          </UButton>
          <UDropdownMenu
            :items="[
              [
                { label: 'Profile', icon: 'i-lucide-user', to: '/dashboard/profile' },
                { label: 'Settings', icon: 'i-lucide-settings', to: '/dashboard/settings' },
              ],
              [
                { label: 'Sign Out', icon: 'i-lucide-log-out', click: logout },
              ],
            ]"
          >
            <UAvatar
              :src="user?.image"
              :alt="user?.name || 'User'"
              size="sm"
              class="cursor-pointer"
            />
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton to="/auth/login" variant="ghost">
            Sign In
          </UButton>
          <UButton to="/auth/register">
            Get Started
          </UButton>
        </template>
      </div>
    </div>
  </header>
</template>
