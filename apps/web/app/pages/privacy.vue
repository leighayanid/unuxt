<script setup lang="ts">
useSeoMeta({
  title: "Privacy Policy - UNuxt",
});
</script>

<template>
  <div class="container mx-auto px-4 py-16 max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>

    <div class="prose prose-neutral dark:prose-invert">
      <p class="text-muted">Last updated: {{ new Date().toLocaleDateString() }}</p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>

      <h2>Information Sharing</h2>
      <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us.</p>
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
