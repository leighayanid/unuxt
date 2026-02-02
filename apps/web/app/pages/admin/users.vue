<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "admin"],
});

useSeoMeta({
  title: "User Management - UNuxt",
});

const search = ref("");
const { data: users, pending, refresh } = useFetch("/api/admin/users");

const filteredUsers = computed(() => {
  if (!users.value) return [];
  if (!search.value) return users.value;

  const searchLower = search.value.toLowerCase();
  return users.value.filter(
    (user: any) =>
      user.email.toLowerCase().includes(searchLower) ||
      user.name?.toLowerCase().includes(searchLower)
  );
});

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "admin":
      return "error";
    default:
      return "neutral";
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">User Management</h1>
        <p class="text-muted">View and manage all users</p>
      </div>
      <UButton to="/admin" variant="outline">
        <UIcon name="i-lucide-arrow-left" class="mr-2" />
        Back to Admin
      </UButton>
    </div>

    <!-- Search -->
    <UCard class="mb-6">
      <UInput
        v-model="search"
        placeholder="Search users by email or name..."
        icon="i-lucide-search"
        class="w-full"
      />
    </UCard>

    <!-- Users List -->
    <UCard>
      <div v-if="pending" class="text-center py-8">
        <UIcon name="i-lucide-loader-2" class="text-3xl animate-spin text-muted" />
        <p class="text-muted mt-2">Loading users...</p>
      </div>

      <div v-else-if="!filteredUsers.length" class="text-center py-8">
        <UIcon name="i-lucide-users" class="text-5xl text-muted mb-4" />
        <p class="text-muted">No users found</p>
      </div>

      <div v-else class="divide-y divide-default">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
        >
          <UAvatar :src="user.image" :alt="user.name || user.email" size="md" />

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium truncate">{{ user.name || "No name" }}</p>
              <UBadge :color="getRoleBadgeColor(user.role)" size="xs">
                {{ user.role }}
              </UBadge>
            </div>
            <p class="text-sm text-muted truncate">{{ user.email }}</p>
          </div>

          <div class="flex items-center gap-4 text-sm text-muted">
            <div class="flex items-center gap-1">
              <UIcon
                :name="user.emailVerified ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                :class="user.emailVerified ? 'text-green-500' : 'text-yellow-500'"
              />
              <span>{{ user.emailVerified ? "Verified" : "Unverified" }}</span>
            </div>

            <div class="flex items-center gap-1">
              <UIcon
                :name="user.twoFactorEnabled ? 'i-lucide-shield-check' : 'i-lucide-shield-off'"
                :class="user.twoFactorEnabled ? 'text-green-500' : 'text-muted'"
              />
              <span>{{ user.twoFactorEnabled ? "2FA" : "No 2FA" }}</span>
            </div>
          </div>

          <p class="text-sm text-muted">
            Joined {{ new Date(user.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
