<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Sign Up - Unuxt",
});

const { register, loginWithGoogle, loginWithGitHub } = useAuth();
const toast = useToast();
const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const loading = ref(false);
const showPassword = ref(false);

async function handleSubmit() {
  if (form.password !== form.confirmPassword) {
    toast.add({
      title: "Error",
      description: "Passwords do not match",
      color: "error",
    });
    return;
  }

  loading.value = true;
  try {
    await register(form.email, form.password, form.name);
    toast.add({
      title: "Success",
      description: "Please check your email to verify your account",
      color: "success",
    });
    router.push("/auth/verify-email");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to create account",
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
      description: error.message || `Failed to sign up with ${provider}`,
      color: "error",
    });
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>

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

    <!-- Registration Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UFormField label="Name" name="name">
        <UInput
          v-model="form.name"
          type="text"
          placeholder="Your name"
          required
          autocomplete="name"
        />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          required
          autocomplete="email"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Create a password"
          required
          autocomplete="new-password"
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

      <UFormField label="Confirm Password" name="confirmPassword">
        <UInput
          v-model="form.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Confirm your password"
          required
          autocomplete="new-password"
        />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Create Account
      </UButton>
    </form>

    <div class="mt-6 text-center text-sm">
      <span class="text-muted">Already have an account? </span>
      <NuxtLink to="/auth/login" class="text-primary hover:underline">
        Sign in
      </NuxtLink>
    </div>
  </div>
</template>
