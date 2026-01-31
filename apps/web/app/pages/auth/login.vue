<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Sign In - UNuxt",
});

const { login, loginWithGoogle, loginWithGitHub } = useAuth();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const form = reactive({
  email: "",
  password: "",
});
const loading = ref(false);
const showPassword = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await login(form.email, form.password);
    const redirect = (route.query.redirect as string) || "/dashboard";
    router.push(redirect);
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to sign in",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

async function handleOAuth(provider: "google" | "github") {
  try {
    if (provider === "google") {
      await loginWithGoogle();
    } else {
      await loginWithGitHub();
    }
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || `Failed to sign in with ${provider}`,
      color: "error",
    });
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6">Sign In</h2>

    <!-- OAuth Buttons -->
    <div class="space-y-3 mb-6">
      <UButton
        block
        variant="outline"
        icon="i-simple-icons-google"
        @click="handleOAuth('google')"
      >
        Continue with Google
      </UButton>
      <UButton
        block
        variant="outline"
        icon="i-simple-icons-github"
        @click="handleOAuth('github')"
      >
        Continue with GitHub
      </UButton>
    </div>

    <UDivider label="or" class="my-6" />

    <!-- Email/Password Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UFormField label="Email" name="email">
        <UInput
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          required
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          required
          autocomplete="current-password"
          class="w-full"
        >
          <template #trailing>
            <UButton
              variant="ghost"
              size="xs"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex items-center justify-between">
        <NuxtLink to="/auth/forgot-password" class="text-sm text-primary hover:underline">
          Forgot password?
        </NuxtLink>
      </div>

      <UButton type="submit" block :loading="loading">
        Sign In
      </UButton>
    </form>

    <div class="mt-6 text-center text-sm">
      <span class="text-muted">Don't have an account? </span>
      <NuxtLink to="/auth/register" class="text-primary hover:underline">
        Sign up
      </NuxtLink>
    </div>

    <div class="mt-4 text-center">
      <NuxtLink to="/auth/magic-link" class="text-sm text-muted hover:text-primary">
        Sign in with magic link
      </NuxtLink>
    </div>
  </div>
</template>
