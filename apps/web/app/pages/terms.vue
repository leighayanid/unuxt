<script setup lang="ts">
useSeoMeta({
  title: "Terms of Service - UNuxt",
});
</script>

<template>
  <div class="container mx-auto px-4 py-16 max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>

    <div class="prose prose-neutral dark:prose-invert">
      <p class="text-muted">Last updated: {{ new Date().toLocaleDateString() }}</p>

      <h2>Acceptance of Terms</h2>
      <p>By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement.</p>

      <h2>Use of Service</h2>
      <p>You agree to use this service only for lawful purposes and in accordance with these Terms of Service.</p>

      <h2>User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

      <h2>Termination</h2>
      <p>We reserve the right to terminate or suspend your account at any time for any reason without prior notice.</p>

      <h2>Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the modified terms.</p>
    </div>

    <div class="mt-8">
      <NuxtLink to="/">
        <UButton variant="ghost">
          Back to Home
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>
