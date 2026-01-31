<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <h1 class="text-6xl font-bold text-primary mb-4">
        {{ error.statusCode }}
      </h1>
      <h2 class="text-2xl font-semibold mb-2">
        {{ error.statusCode === 404 ? "Page Not Found" : "Something went wrong" }}
      </h2>
      <p class="text-muted mb-8">
        {{ error.message || "An unexpected error occurred. Please try again." }}
      </p>
      <UButton size="lg" @click="handleError">
        Go Home
      </UButton>
    </div>
  </div>
</template>
