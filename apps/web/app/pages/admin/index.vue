<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "admin"],
});

useSeoMeta({
  title: "Admin Dashboard - UNuxt",
});

const { data: stats, pending } = useFetch("/api/admin/stats");
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p class="text-muted">System overview and management</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-lg">
            <UIcon name="i-lucide-users" class="text-2xl text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted">Total Users</p>
            <p class="text-xl font-semibold">
              <template v-if="pending">...</template>
              <template v-else>{{ stats?.users ?? 0 }}</template>
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-500/10 rounded-lg">
            <UIcon name="i-lucide-building-2" class="text-2xl text-green-500" />
          </div>
          <div>
            <p class="text-sm text-muted">Organizations</p>
            <p class="text-xl font-semibold">
              <template v-if="pending">...</template>
              <template v-else>{{ stats?.organizations ?? 0 }}</template>
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-500/10 rounded-lg">
            <UIcon name="i-lucide-key" class="text-2xl text-blue-500" />
          </div>
          <div>
            <p class="text-sm text-muted">Active Sessions</p>
            <p class="text-xl font-semibold">
              <template v-if="pending">...</template>
              <template v-else>{{ stats?.sessions ?? 0 }}</template>
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Quick Actions</h2>
      </template>

      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <UButton to="/admin/users" variant="outline" block>
          <UIcon name="i-lucide-users" class="mr-2" />
          Manage Users
        </UButton>
        <UButton to="/dashboard" variant="outline" block>
          <UIcon name="i-lucide-layout-dashboard" class="mr-2" />
          User Dashboard
        </UButton>
        <UButton to="/org" variant="outline" block>
          <UIcon name="i-lucide-building-2" class="mr-2" />
          Organizations
        </UButton>
        <UButton to="/docs" variant="outline" block>
          <UIcon name="i-lucide-book-open" class="mr-2" />
          Documentation
        </UButton>
      </div>
    </UCard>
  </div>
</template>
