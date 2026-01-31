<script setup lang="ts">
const { $authClient } = useNuxtApp();

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Forgot Password - UNuxt",
});

const toast = useToast();

const email = ref("");
const loading = ref(false);
const sent = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await $authClient.forgetPassword({
      email: email.value,
      redirectTo: "/auth/reset-password",
    });
    sent.value = true;
    toast.add({
      title: "Email Sent",
      description: "Check your email for a password reset link",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to send reset email",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-2">Forgot Password</h2>
    <p class="text-muted text-center mb-6">
      Enter your email and we'll send you a reset link
    </p>

    <div v-if="sent" class="text-center">
      <UIcon name="i-lucide-mail-check" class="text-5xl text-primary mb-4" />
      <p class="mb-4">We've sent a password reset link to your email.</p>
      <UButton variant="outline" @click="sent = false">
        Send again
      </UButton>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <UFormField label="Email" name="email">
        <UInput
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Send Reset Link
      </UButton>
    </form>

    <div class="mt-6 text-center">
      <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline">
        Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>
