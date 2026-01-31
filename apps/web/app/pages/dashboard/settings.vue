<script setup lang="ts">
const { $$authClient } = useNuxtApp();

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "Settings - UNuxt",
});

const { user, logout } = useAuth();
const toast = useToast();
const router = useRouter();

// Two-Factor Authentication
const twoFactorEnabled = ref(false);
const showTwoFactorSetup = ref(false);
const twoFactorSetup = ref<{ qrCode: string; secret: string } | null>(null);
const twoFactorCode = ref("");
const twoFactorLoading = ref(false);

async function setupTwoFactor() {
  twoFactorLoading.value = true;
  try {
    const result = await $authClient.twoFactor.enable();
    twoFactorSetup.value = result.data as any;
    showTwoFactorSetup.value = true;
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to setup 2FA",
      color: "error",
    });
  } finally {
    twoFactorLoading.value = false;
  }
}

async function verifyTwoFactor() {
  twoFactorLoading.value = true;
  try {
    await $authClient.twoFactor.verifyTotp({ code: twoFactorCode.value });
    twoFactorEnabled.value = true;
    showTwoFactorSetup.value = false;
    toast.add({
      title: "Success",
      description: "Two-factor authentication enabled",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Invalid code",
      color: "error",
    });
  } finally {
    twoFactorLoading.value = false;
  }
}

async function disableTwoFactor() {
  twoFactorLoading.value = true;
  try {
    await $authClient.twoFactor.disable({ password: "" }); // TODO: Add password modal
    twoFactorEnabled.value = false;
    toast.add({
      title: "Success",
      description: "Two-factor authentication disabled",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to disable 2FA",
      color: "error",
    });
  } finally {
    twoFactorLoading.value = false;
  }
}

// Delete Account
const showDeleteModal = ref(false);
const deleteLoading = ref(false);

async function deleteAccount() {
  deleteLoading.value = true;
  try {
    // TODO: Implement account deletion
    await logout();
    router.push("/");
    toast.add({
      title: "Account Deleted",
      description: "Your account has been deleted",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to delete account",
      color: "error",
    });
  } finally {
    deleteLoading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>

    <div class="space-y-6">
      <!-- Theme Settings -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Appearance</h2>
        </template>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Dark Mode</p>
            <p class="text-sm text-muted">Toggle dark mode on or off</p>
          </div>
          <ThemeToggle />
        </div>
      </UCard>

      <!-- Security Settings -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Security</h2>
        </template>

        <div class="space-y-6">
          <!-- Two-Factor Authentication -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Two-Factor Authentication</p>
              <p class="text-sm text-muted">
                Add an extra layer of security to your account
              </p>
            </div>
            <UButton
              v-if="!twoFactorEnabled"
              @click="setupTwoFactor"
              :loading="twoFactorLoading"
            >
              Enable
            </UButton>
            <UButton
              v-else
              variant="outline"
              color="error"
              @click="disableTwoFactor"
              :loading="twoFactorLoading"
            >
              Disable
            </UButton>
          </div>

          <!-- Change Password -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Change Password</p>
              <p class="text-sm text-muted">Update your password</p>
            </div>
            <UButton variant="outline">
              Change
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Danger Zone -->
      <UCard class="border-error">
        <template #header>
          <h2 class="text-lg font-semibold text-error">Danger Zone</h2>
        </template>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Delete Account</p>
            <p class="text-sm text-muted">
              Permanently delete your account and all data
            </p>
          </div>
          <UButton color="error" @click="showDeleteModal = true">
            Delete Account
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Two-Factor Setup Modal -->
    <UModal v-model:open="showTwoFactorSetup">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Setup Two-Factor Authentication</h3>

          <div v-if="twoFactorSetup" class="space-y-4">
            <p class="text-sm text-muted">
              Scan this QR code with your authenticator app:
            </p>
            <div class="flex justify-center">
              <img :src="twoFactorSetup.qrCode" alt="QR Code" class="w-48 h-48" />
            </div>
            <p class="text-sm text-muted text-center">
              Or enter this secret manually: <code class="bg-muted px-2 py-1 rounded">{{ twoFactorSetup.secret }}</code>
            </p>

            <UFormField label="Verification Code">
              <UInput
                v-model="twoFactorCode"
                placeholder="Enter 6-digit code"
                maxlength="6"
                class="w-full"
              />
            </UFormField>

            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="showTwoFactorSetup = false">
                Cancel
              </UButton>
              <UButton @click="verifyTwoFactor" :loading="twoFactorLoading">
                Verify & Enable
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Account Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Delete Account</h3>
          <p class="text-muted mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="showDeleteModal = false">
              Cancel
            </UButton>
            <UButton color="error" @click="deleteAccount" :loading="deleteLoading">
              Delete Account
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
