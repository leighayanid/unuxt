<script setup lang="ts">
const route = useRoute();
const { isAdmin } = usePermissions();

const navigation = computed(() => [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/dashboard",
  },
  {
    label: "Profile",
    icon: "i-lucide-user",
    to: "/dashboard/profile",
  },
  {
    label: "Organizations",
    icon: "i-lucide-building-2",
    to: "/org",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/dashboard/settings",
  },
]);

const adminNavigation = computed(() => [
  {
    label: "Admin",
    icon: "i-lucide-shield",
    to: "/admin",
  },
  {
    label: "Users",
    icon: "i-lucide-users",
    to: "/admin/users",
  },
]);

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + "/");
}
</script>

<template>
  <nav class="p-4 space-y-2">
    <NuxtLink
      v-for="item in navigation"
      :key="item.to"
      :to="item.to"
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
        isActive(item.to)
          ? 'bg-primary/10 text-primary'
          : 'text-muted hover:bg-muted hover:text-default'
      ]"
    >
      <UIcon :name="item.icon" class="text-lg" />
      <span>{{ item.label }}</span>
    </NuxtLink>

    <template v-if="isAdmin">
      <div class="pt-4 pb-2">
        <p class="px-3 text-xs font-medium text-muted uppercase">Admin</p>
      </div>
      <NuxtLink
        v-for="item in adminNavigation"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
          isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:bg-muted hover:text-default'
        ]"
      >
        <UIcon :name="item.icon" class="text-lg" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>
