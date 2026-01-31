<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-default py-8 px-4">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-muted text-sm">
          &copy; {{ year }} UNuxt. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-sm text-muted hover:text-default">
            Privacy
          </NuxtLink>
          <NuxtLink to="/terms" class="text-sm text-muted hover:text-default">
            Terms
          </NuxtLink>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            class="text-muted hover:text-default"
          >
            <UIcon name="i-simple-icons-github" class="text-xl" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
