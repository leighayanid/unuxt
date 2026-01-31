<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "Organizations - UNuxt",
});

const { organizations } = useOrganization();
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Organizations</h1>
        <p class="text-muted">Manage your organizations and teams</p>
      </div>
      <UButton to="/org/create" icon="i-lucide-plus">
        Create Organization
      </UButton>
    </div>

    <div v-if="organizations.length === 0" class="text-center py-12">
      <UIcon name="i-lucide-building-2" class="text-5xl text-muted mb-4" />
      <h3 class="text-lg font-medium mb-2">No organizations yet</h3>
      <p class="text-muted mb-4">Create your first organization to get started</p>
      <UButton to="/org/create">Create Organization</UButton>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="org in organizations"
        :key="org.id"
        class="hover:border-primary transition-colors cursor-pointer"
        @click="navigateTo(`/org/${org.id}`)"
      >
        <div class="flex items-center gap-4">
          <UAvatar
            :src="org.logo"
            :alt="org.name"
            size="lg"
          />
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold truncate">{{ org.name }}</h3>
            <p class="text-sm text-muted">{{ org.slug }}</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="text-muted" />
        </div>
      </UCard>
    </div>
  </div>
</template>
