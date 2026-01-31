<script setup lang="ts">
const { user, logout } = useAuth();
</script>

<template>
  <UDropdown
    :items="[
      [
        {
          label: user?.name || 'User',
          slot: 'header',
          disabled: true,
        },
      ],
      [
        { label: 'Profile', icon: 'i-lucide-user', to: '/dashboard/profile' },
        { label: 'Settings', icon: 'i-lucide-settings', to: '/dashboard/settings' },
      ],
      [
        { label: 'Sign Out', icon: 'i-lucide-log-out', click: logout },
      ],
    ]"
    :popper="{ placement: 'bottom-end' }"
  >
    <UAvatar
      :src="user?.image"
      :alt="user?.name || 'User'"
      size="sm"
      class="cursor-pointer"
    />

    <template #header="{ item }">
      <div class="text-left">
        <p class="font-medium truncate">{{ item.label }}</p>
        <p class="text-xs text-muted truncate">{{ user?.email }}</p>
      </div>
    </template>
  </UDropdown>
</template>
