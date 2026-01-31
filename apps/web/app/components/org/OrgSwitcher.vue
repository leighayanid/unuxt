<script setup lang="ts">
const { activeOrg, organizations, switchOrganization } = useOrganization();
const router = useRouter();

async function handleSwitch(orgId: string) {
  await switchOrganization(orgId);
}

function goToCreate() {
  router.push("/org/create");
}
</script>

<template>
  <UDropdownMenu
    :items="[
      organizations.map((org: any) => ({
        label: org.name,
        icon: activeOrg?.id === org.id ? 'i-lucide-check' : undefined,
        click: () => handleSwitch(org.id),
      })),
      [
        { label: 'Create Organization', icon: 'i-lucide-plus', click: goToCreate },
        { label: 'Manage Organizations', icon: 'i-lucide-settings', to: '/org' },
      ],
    ]"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton variant="ghost" class="gap-2">
      <UIcon name="i-lucide-building-2" />
      <span class="hidden sm:inline">{{ activeOrg?.name || 'Select Organization' }}</span>
      <UIcon name="i-lucide-chevron-down" class="text-xs" />
    </UButton>
  </UDropdownMenu>
</template>
