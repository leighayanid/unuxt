<script setup lang="ts">
definePageMeta({
  middleware: "guest",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-2xl font-bold text-primary">UNuxt</h1>
        </NuxtLink>
      </div>
      <UCard>
        <slot />
      </UCard>
    </div>
  </div>
</template>
