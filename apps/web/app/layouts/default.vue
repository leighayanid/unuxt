<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="min-h-screen bg-default">
    <AppHeader />
    <main class="pt-[var(--app-header-height)]">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
