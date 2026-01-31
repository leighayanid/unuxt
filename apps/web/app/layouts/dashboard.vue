<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const sidebarOpen = ref(true);
const { user } = useAuth();
const { activeOrg, organizations } = useOrganization();
</script>

<template>
  <div class="min-h-screen bg-muted">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 h-[var(--app-header-height)] bg-default border-b border-default z-40">
      <div class="flex items-center justify-between h-full px-4">
        <div class="flex items-center gap-4">
          <UButton
            variant="ghost"
            icon="i-lucide-menu"
            size="sm"
            @click="sidebarOpen = !sidebarOpen"
          />
          <NuxtLink to="/dashboard" class="font-bold text-lg">
            Unuxt
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <OrgSwitcher />
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-[var(--app-header-height)] left-0 bottom-0 w-[var(--app-sidebar-width)] bg-default border-r border-default transition-transform z-30',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <AppSidebar />
    </aside>

    <!-- Main content -->
    <main
      :class="[
        'pt-[var(--app-header-height)] min-h-screen transition-all',
        sidebarOpen ? 'pl-[var(--app-sidebar-width)]' : 'pl-0'
      ]"
    >
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
