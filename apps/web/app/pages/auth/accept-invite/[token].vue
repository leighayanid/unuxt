<script setup lang="ts">
const route = useRoute();
const toast = useToast();
const { user } = useAuth();
const { $authClient } = useNuxtApp();

definePageMeta({
  layout: "auth",
  middleware: [], // No auth required - unauthenticated users can view
});

useSeoMeta({
  title: "Accept Invitation - UNuxt",
});

const token = computed(() => route.params.token as string);
const isAccepting = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const organizationName = ref<string | null>(null);

// Check if user is logged in and auto-accept
onMounted(async () => {
  if (user.value) {
    await acceptInvitation();
  }
});

async function acceptInvitation() {
  if (!token.value) {
    error.value = "Invalid invitation link";
    return;
  }

  isAccepting.value = true;
  error.value = null;

  try {
    const result = await $authClient.organization.acceptInvitation({
      invitationId: token.value,
    });

    if (result.error) {
      // Handle specific error cases
      const errorMessage = result.error.message?.toLowerCase() || "";

      if (errorMessage.includes("expired")) {
        error.value = "This invitation has expired. Please request a new invitation.";
      } else if (errorMessage.includes("already accepted") || errorMessage.includes("already a member")) {
        error.value = "You are already a member of this organization.";
      } else if (errorMessage.includes("not found")) {
        error.value = "This invitation is invalid or has been cancelled.";
      } else {
        error.value = result.error.message || "Failed to accept invitation";
      }
      return;
    }

    // Success!
    success.value = true;
    organizationName.value = result.data?.organization?.name || "the organization";

    toast.add({
      title: "Success",
      description: `You've joined ${organizationName.value}!`,
      color: "success",
    });

    // Redirect to organization page after 2 seconds
    setTimeout(() => {
      if (result.data?.organization?.id) {
        navigateTo(`/org/${result.data.organization.id}`);
      } else {
        navigateTo("/org");
      }
    }, 2000);
  } catch (err: any) {
    console.error("Failed to accept invitation:", err);
    error.value = err.message || "An unexpected error occurred";
  } finally {
    isAccepting.value = false;
  }
}

function handleLoginRedirect() {
  // Redirect to login with return URL
  navigateTo(`/auth/signin?callbackUrl=${encodeURIComponent(route.fullPath)}`);
}

function handleSignupRedirect() {
  // Redirect to signup with return URL
  navigateTo(`/auth/signup?callbackUrl=${encodeURIComponent(route.fullPath)}`);
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <!-- Loading State -->
      <div v-if="isAccepting" class="text-center py-12">
        <UIcon name="i-lucide-loader-2" class="text-5xl animate-spin text-primary mb-4" />
        <h2 class="text-xl font-semibold mb-2">Accepting Invitation...</h2>
        <p class="text-muted">Please wait while we process your invitation.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center py-12">
        <UIcon name="i-lucide-check-circle" class="text-5xl text-success mb-4" />
        <h2 class="text-xl font-semibold mb-2">Welcome!</h2>
        <p class="text-muted mb-4">
          You've successfully joined {{ organizationName }}.
        </p>
        <p class="text-sm text-muted">Redirecting you now...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-lucide-x-circle" class="text-5xl text-error mb-4" />
        <h2 class="text-xl font-semibold mb-2">Unable to Accept Invitation</h2>
        <p class="text-muted mb-6">{{ error }}</p>
        <div class="flex flex-col gap-2">
          <UButton to="/org" variant="outline">
            Go to Organizations
          </UButton>
          <UButton to="/" variant="ghost">
            Go Home
          </UButton>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else-if="!user" class="text-center py-12">
        <UIcon name="i-lucide-mail" class="text-5xl text-primary mb-4" />
        <h2 class="text-xl font-semibold mb-2">You've Been Invited!</h2>
        <p class="text-muted mb-6">
          Please sign in or create an account to accept this invitation.
        </p>
        <div class="flex flex-col gap-3">
          <UButton @click="handleLoginRedirect" size="lg" class="w-full">
            <UIcon name="i-lucide-log-in" class="mr-2" />
            Sign In
          </UButton>
          <UButton @click="handleSignupRedirect" variant="outline" size="lg" class="w-full">
            <UIcon name="i-lucide-user-plus" class="mr-2" />
            Create Account
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
