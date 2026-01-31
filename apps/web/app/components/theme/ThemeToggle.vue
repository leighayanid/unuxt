<script setup lang="ts">
const { isDark, toggleColorMode } = useTheme();
</script>

<template>
  <UButton
    variant="ghost"
    size="sm"
    :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
    @click="toggleColorMode"
    aria-label="Toggle color mode"
  />
</template>
