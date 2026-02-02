<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

useSeoMeta({
  title: "Magic Link - UNuxt",
});

const { loginWithMagicLink } = useAuth();
const toast = useToast();

const email = ref("");
const loading = ref(false);
const sent = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await loginWithMagicLink(email.value);
    sent.value = true;
    toast.add({
      title: "Email Sent",
      description: "Check your email for a magic sign-in link",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to send magic link",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-2">Magic Link</h2>
    <p class="text-muted text-center mb-6">
      Sign in without a password
    </p>

    <div v-if="sent" class="text-center">
      <UIcon name="i-lucide-mail-check" class="text-5xl text-primary mb-4" />
      <p class="mb-4">Check your email for a magic sign-in link.</p>
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
        Send Magic Link
      </UButton>
    </form>

    <div class="mt-6 text-center">
      <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline">
        Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>
