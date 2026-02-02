<script setup lang="ts">
definePageMeta({
  layout: false,
});

// Redirect to docs subdomain
await navigateTo("https://docs.unuxt.dev", { external: true });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-muted mb-4">Redirecting to documentation...</p>
      <UButton to="https://docs.unuxt.dev" external>
        Go to Documentation
      </UButton>
    </div>
  </div>
</template>
