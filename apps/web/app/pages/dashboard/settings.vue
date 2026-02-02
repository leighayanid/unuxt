<script setup lang="ts">
const { $authClient } = useNuxtApp();

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

// 2FA Disable Modal
const showDisable2FAModal = ref(false);
const disable2FAPassword = ref("");

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
    twoFactorCode.value = "";
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

function openDisable2FAModal() {
  disable2FAPassword.value = "";
  showDisable2FAModal.value = true;
}

async function disableTwoFactor() {
  if (!disable2FAPassword.value) {
    toast.add({
      title: "Error",
      description: "Password is required",
      color: "error",
    });
    return;
  }

  twoFactorLoading.value = true;
  try {
    await $authClient.twoFactor.disable({ password: disable2FAPassword.value });
    twoFactorEnabled.value = false;
    showDisable2FAModal.value = false;
    disable2FAPassword.value = "";
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
const deleteAccountPassword = ref("");

async function deleteAccount() {
  if (!deleteAccountPassword.value) {
    toast.add({
      title: "Error",
      description: "Password is required to delete your account",
      color: "error",
    });
    return;
  }

  deleteLoading.value = true;
  try {
    await $fetch("/api/account/delete", {
      method: "POST",
      body: { password: deleteAccountPassword.value },
    });

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
      description: error.data?.message || error.message || "Failed to delete account",
      color: "error",
    });
  } finally {
    deleteLoading.value = false;
  }
}

function openDeleteModal() {
  deleteAccountPassword.value = "";
  showDeleteModal.value = true;
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
              @click="openDisable2FAModal"
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
          <UButton color="error" @click="openDeleteModal">
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

    <!-- Disable 2FA Modal -->
    <UModal v-model:open="showDisable2FAModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Disable Two-Factor Authentication</h3>

          <p class="text-muted mb-4">
            Enter your password to disable two-factor authentication.
          </p>

          <UFormField label="Password">
            <UInput
              v-model="disable2FAPassword"
              type="password"
              placeholder="Enter your password"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2 mt-6">
            <UButton variant="outline" @click="showDisable2FAModal = false">
              Cancel
            </UButton>
            <UButton
              color="error"
              @click="disableTwoFactor"
              :loading="twoFactorLoading"
            >
              Disable 2FA
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Account Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4 text-error">Delete Account</h3>

          <p class="text-muted mb-4">
            Are you sure you want to delete your account? This action cannot be undone.
            All your data, including organizations you own, will be permanently deleted.
          </p>

          <UFormField label="Password" class="mb-6">
            <UInput
              v-model="deleteAccountPassword"
              type="password"
              placeholder="Enter your password to confirm"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="showDeleteModal = false">
              Cancel
            </UButton>
            <UButton
              color="error"
              @click="deleteAccount"
              :loading="deleteLoading"
              :disabled="!deleteAccountPassword"
            >
              Delete Account
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
