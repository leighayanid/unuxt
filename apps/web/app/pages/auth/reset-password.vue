<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

useSeoMeta({
  title: "Reset Password - UNuxt",
});

const { resetPassword } = useAuth();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const form = reactive({
  password: "",
  confirmPassword: "",
});
const loading = ref(false);
const showPassword = ref(false);
const error = ref("");

// Get token from URL query params
const token = computed(() => route.query.token as string);

// Redirect if no token
onMounted(() => {
  if (!token.value) {
    toast.add({
      title: "Invalid Link",
      description: "This password reset link is invalid or has expired",
      color: "error",
    });
    router.push("/auth/forgot-password");
  }
});

async function handleSubmit() {
  error.value = "";

  if (form.password.length < 8) {
    error.value = "Password must be at least 8 characters";
    return;
  }

  if (form.password !== form.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  try {
    await resetPassword(token.value, form.password);

    toast.add({
      title: "Password Reset",
      description: "Your password has been reset successfully",
      color: "success",
    });

    router.push("/auth/login");
  } catch (err: any) {
    const message = err.message || "Failed to reset password";
    error.value = message;
    toast.add({
      title: "Error",
      description: message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-2">Reset Password</h2>
    <p class="text-muted text-center mb-6">
      Enter your new password below
    </p>

    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-alert-circle"
      :title="error"
      class="mb-4"
    />

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UFormField label="New Password" name="password">
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter new password"
          required
          minlength="8"
          autocomplete="new-password"
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

      <UFormField label="Confirm Password" name="confirmPassword">
        <UInput
          v-model="form.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Confirm new password"
          required
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Reset Password
      </UButton>
    </form>

    <div class="mt-6 text-center">
      <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline">
        Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>
