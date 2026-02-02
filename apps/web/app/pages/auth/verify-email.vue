<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Verify Email - UNuxt",
});

const { verifyEmail } = useAuth();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const verifying = ref(false);
const verified = ref(false);
const error = ref("");

// Get token from URL query params
const token = computed(() => route.query.token as string);

// Verify email if token is present
onMounted(async () => {
  if (token.value) {
    verifying.value = true;
    try {
      await verifyEmail(token.value);
      verified.value = true;
      toast.add({
        title: "Email Verified",
        description: "Your email has been verified successfully",
        color: "success",
      });
    } catch (err: any) {
      error.value = err.message || "Failed to verify email";
      toast.add({
        title: "Verification Failed",
        description: error.value,
        color: "error",
      });
    } finally {
      verifying.value = false;
    }
  }
});
</script>

<template>
  <div class="text-center">
    <!-- Verifying state -->
    <template v-if="verifying">
      <div class="mb-6">
        <UIcon name="i-lucide-loader-2" class="w-16 h-16 text-primary mx-auto animate-spin" />
      </div>
      <h2 class="text-2xl font-bold mb-4">Verifying your email...</h2>
      <p class="text-muted">Please wait while we verify your email address.</p>
    </template>

    <!-- Verified state -->
    <template v-else-if="verified">
      <div class="mb-6">
        <UIcon name="i-lucide-check-circle" class="w-16 h-16 text-success mx-auto" />
      </div>
      <h2 class="text-2xl font-bold mb-4">Email Verified!</h2>
      <p class="text-muted mb-6">Your email has been verified. You can now sign in to your account.</p>
      <NuxtLink to="/auth/login">
        <UButton block>
          Sign In
        </UButton>
      </NuxtLink>
    </template>

    <!-- Error state -->
    <template v-else-if="error">
      <div class="mb-6">
        <UIcon name="i-lucide-x-circle" class="w-16 h-16 text-error mx-auto" />
      </div>
      <h2 class="text-2xl font-bold mb-4">Verification Failed</h2>
      <p class="text-muted mb-6">{{ error }}</p>
      <NuxtLink to="/auth/login">
        <UButton variant="outline" block>
          Back to Sign In
        </UButton>
      </NuxtLink>
    </template>

    <!-- Default state (no token) -->
    <template v-else>
      <div class="mb-6">
        <UIcon name="i-lucide-mail-check" class="w-16 h-16 text-primary mx-auto" />
      </div>
      <h2 class="text-2xl font-bold mb-4">Check your email</h2>
      <p class="text-muted mb-6">
        We've sent a verification link to your email address. Please click the link to verify your account.
      </p>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          Didn't receive the email? Check your spam folder.
        </p>
        <NuxtLink to="/auth/login">
          <UButton variant="outline" block>
            Back to Sign In
          </UButton>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
