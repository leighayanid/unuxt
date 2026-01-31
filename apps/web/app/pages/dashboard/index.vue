<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "Dashboard - UNuxt",
});

const { user } = useAuth();
const { activeOrg } = useOrganization();
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        Welcome back, {{ user?.name || "User" }}
      </h1>
      <p class="text-muted">
        Here's what's happening with your account today.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-lg">
            <UIcon name="i-lucide-building-2" class="text-2xl text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted">Current Organization</p>
            <p class="text-xl font-semibold">{{ activeOrg?.name || "None" }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-500/10 rounded-lg">
            <UIcon name="i-lucide-check-circle" class="text-2xl text-green-500" />
          </div>
          <div>
            <p class="text-sm text-muted">Account Status</p>
            <p class="text-xl font-semibold">Active</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-500/10 rounded-lg">
            <UIcon name="i-lucide-shield" class="text-2xl text-blue-500" />
          </div>
          <div>
            <p class="text-sm text-muted">Security</p>
            <p class="text-xl font-semibold">Protected</p>
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
        <UButton to="/dashboard/profile" variant="outline" block>
          <UIcon name="i-lucide-user" class="mr-2" />
          Edit Profile
        </UButton>
        <UButton to="/dashboard/settings" variant="outline" block>
          <UIcon name="i-lucide-settings" class="mr-2" />
          Settings
        </UButton>
        <UButton to="/org" variant="outline" block>
          <UIcon name="i-lucide-building-2" class="mr-2" />
          Organizations
        </UButton>
        <UButton to="/org/create" variant="outline" block>
          <UIcon name="i-lucide-plus" class="mr-2" />
          New Organization
        </UButton>
      </div>
    </UCard>
  </div>
</template>
