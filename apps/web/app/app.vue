<script setup lang="ts">
const colorMode = useColorMode();

// Apply color mode class to html element
useHead({
  htmlAttrs: {
    class: computed(() => colorMode.value),
  },
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
