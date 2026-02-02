<script setup lang="ts">
const route = useRoute();
const toast = useToast();

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { $authClient } = useNuxtApp();
const { user } = useAuth();
const {
  updateOrganization,
  deleteOrganization,
  inviteMember,
  removeMember,
  updateMemberRole,
  cancelInvitation,
  switchOrganization,
} = useOrganization();
const { uploadImage, isUploading } = useCloudinaryUpload();

// Fetch organization data
const orgId = computed(() => route.params.id as string);

const { data: orgData, pending, refresh } = await useFetch(
  () => `/api/org/${orgId.value}`,
  {
    key: `org-${orgId.value}`,
  }
);

const org = computed(() => orgData.value?.organization);
const members = computed(() => orgData.value?.members || []);
const invitations = computed(() => orgData.value?.invitations || []);

useSeoMeta({
  title: () => `${org.value?.name || "Organization"} - UNuxt`,
});

// Permission checks based on current user's role in org
const currentMember = computed(() =>
  members.value.find((m: any) => m.userId === user.value?.id)
);
const currentRole = computed(() => currentMember.value?.role);
const isOwner = computed(() => currentRole.value === "owner");
const isAdmin = computed(() => ["owner", "admin"].includes(currentRole.value || ""));
const canUpdateOrg = computed(() => isOwner.value);
const canManageMembers = computed(() => isAdmin.value);
const canDeleteOrg = computed(() => isOwner.value);

// Organization Settings Form
const showSettingsModal = ref(false);
const settingsForm = ref({
  name: "",
  slug: "",
});
const settingsLoading = ref(false);

function openSettingsModal() {
  if (org.value) {
    settingsForm.value = {
      name: org.value.name,
      slug: org.value.slug,
    };
  }
  showSettingsModal.value = true;
}

async function saveSettings() {
  settingsLoading.value = true;
  try {
    await switchOrganization(orgId.value);
    await updateOrganization(settingsForm.value);
    await refresh();
    showSettingsModal.value = false;
    toast.add({
      title: "Success",
      description: "Organization settings updated",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to update settings",
      color: "error",
    });
  } finally {
    settingsLoading.value = false;
  }
}

// Logo Upload
const logoInput = ref<HTMLInputElement | null>(null);

async function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    await switchOrganization(orgId.value);
    const result = await uploadImage(file, { folder: "org-logos" });
    await updateOrganization({ logo: result.secure_url });
    await refresh();
    toast.add({
      title: "Success",
      description: "Logo updated successfully",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to upload logo",
      color: "error",
    });
  }
}

// Invite Member
const showInviteModal = ref(false);
const inviteForm = ref({
  email: "",
  role: "member" as "admin" | "member",
});
const inviteLoading = ref(false);

async function sendInvite() {
  inviteLoading.value = true;
  try {
    await switchOrganization(orgId.value);
    await inviteMember(inviteForm.value.email, inviteForm.value.role);
    await refresh();
    showInviteModal.value = false;
    inviteForm.value = { email: "", role: "member" };
    toast.add({
      title: "Success",
      description: "Invitation sent successfully",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to send invitation",
      color: "error",
    });
  } finally {
    inviteLoading.value = false;
  }
}

// Member Management
async function handleRoleChange(memberId: string, newRole: string) {
  try {
    await switchOrganization(orgId.value);
    await updateMemberRole(memberId, newRole);
    await refresh();
    toast.add({
      title: "Success",
      description: "Member role updated",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to update role",
      color: "error",
    });
  }
}

async function handleRemoveMember(memberId: string) {
  if (!confirm("Are you sure you want to remove this member?")) return;

  try {
    await switchOrganization(orgId.value);
    await removeMember(memberId);
    await refresh();
    toast.add({
      title: "Success",
      description: "Member removed successfully",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to remove member",
      color: "error",
    });
  }
}

async function handleCancelInvitation(invitationId: string) {
  try {
    await switchOrganization(orgId.value);
    await cancelInvitation(invitationId);
    await refresh();
    toast.add({
      title: "Success",
      description: "Invitation cancelled",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to cancel invitation",
      color: "error",
    });
  }
}

// Delete Organization
const showDeleteModal = ref(false);
const deleteConfirmName = ref("");
const deleteLoading = ref(false);

async function handleDeleteOrganization() {
  if (deleteConfirmName.value !== org.value?.name) {
    toast.add({
      title: "Error",
      description: "Organization name does not match",
      color: "error",
    });
    return;
  }

  deleteLoading.value = true;
  try {
    await deleteOrganization(orgId.value);
    toast.add({
      title: "Success",
      description: "Organization deleted successfully",
      color: "success",
    });
    await navigateTo("/org");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to delete organization",
      color: "error",
    });
  } finally {
    deleteLoading.value = false;
  }
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "owner":
      return "primary";
    case "admin":
      return "warning";
    default:
      return "neutral";
  }
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="text-4xl animate-spin text-muted" />
    </div>

    <!-- Organization Not Found -->
    <div v-else-if="!org" class="text-center py-12">
      <UIcon name="i-lucide-building-x" class="text-5xl text-muted mb-4" />
      <h2 class="text-xl font-semibold mb-2">Organization Not Found</h2>
      <p class="text-muted mb-4">This organization doesn't exist or you don't have access.</p>
      <UButton to="/org">Back to Organizations</UButton>
    </div>

    <!-- Organization Content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="relative group">
            <UAvatar :src="org.logo" :alt="org.name" size="xl" />
            <button
              v-if="canUpdateOrg"
              class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
              @click="logoInput?.click()"
            >
              <UIcon name="i-lucide-camera" class="text-white text-xl" />
            </button>
            <input
              ref="logoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleLogoUpload"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ org.name }}</h1>
            <p class="text-muted">{{ org.slug }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton v-if="canUpdateOrg" variant="outline" @click="openSettingsModal">
            <UIcon name="i-lucide-settings" class="mr-2" />
            Settings
          </UButton>
          <UButton to="/org" variant="ghost">
            <UIcon name="i-lucide-arrow-left" class="mr-2" />
            Back
          </UButton>
        </div>
      </div>

      <!-- Members Section -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Members</h2>
            <UButton v-if="canManageMembers" size="sm" @click="showInviteModal = true">
              <UIcon name="i-lucide-user-plus" class="mr-2" />
              Invite Member
            </UButton>
          </div>
        </template>

        <div class="divide-y divide-default">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
          >
            <UAvatar :src="member.user?.image" :alt="member.user?.name || member.user?.email" />

            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ member.user?.name || "No name" }}</p>
              <p class="text-sm text-muted truncate">{{ member.user?.email }}</p>
            </div>

            <UBadge :color="getRoleBadgeColor(member.role)" size="sm">
              {{ member.role }}
            </UBadge>

            <UDropdownMenu v-if="canManageMembers && member.userId !== user?.id && member.role !== 'owner'">
              <UButton variant="ghost" icon="i-lucide-more-horizontal" size="sm" />
              <template #content>
                <UDropdownMenuItem
                  v-if="member.role !== 'admin'"
                  @click="handleRoleChange(member.id, 'admin')"
                >
                  <UIcon name="i-lucide-shield" class="mr-2" />
                  Make Admin
                </UDropdownMenuItem>
                <UDropdownMenuItem
                  v-if="member.role !== 'member'"
                  @click="handleRoleChange(member.id, 'member')"
                >
                  <UIcon name="i-lucide-user" class="mr-2" />
                  Make Member
                </UDropdownMenuItem>
                <UDropdownMenuItem
                  class="text-error"
                  @click="handleRemoveMember(member.id)"
                >
                  <UIcon name="i-lucide-user-minus" class="mr-2" />
                  Remove
                </UDropdownMenuItem>
              </template>
            </UDropdownMenu>
          </div>
        </div>
      </UCard>

      <!-- Pending Invitations -->
      <UCard v-if="isAdmin && invitations.length > 0">
        <template #header>
          <h2 class="text-lg font-semibold">Pending Invitations</h2>
        </template>

        <div class="divide-y divide-default">
          <div
            v-for="invitation in invitations"
            :key="invitation.id"
            class="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
          >
            <UAvatar icon="i-lucide-mail" />

            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ invitation.email }}</p>
              <p class="text-sm text-muted">
                Invited as {{ invitation.role }}
              </p>
            </div>

            <UBadge color="warning" size="sm">Pending</UBadge>

            <UButton
              variant="ghost"
              color="error"
              size="sm"
              @click="handleCancelInvitation(invitation.id)"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Danger Zone -->
      <UCard v-if="canDeleteOrg" class="border-error">
        <template #header>
          <h2 class="text-lg font-semibold text-error">Danger Zone</h2>
        </template>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Delete Organization</p>
            <p class="text-sm text-muted">
              Permanently delete this organization and all its data
            </p>
          </div>
          <UButton color="error" @click="showDeleteModal = true">
            Delete Organization
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Settings Modal -->
    <UModal v-model:open="showSettingsModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Organization Settings</h3>

          <div class="space-y-4">
            <UFormField label="Name">
              <UInput v-model="settingsForm.name" placeholder="Organization name" class="w-full" />
            </UFormField>

            <UFormField label="Slug">
              <UInput v-model="settingsForm.slug" placeholder="organization-slug" class="w-full" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <UButton variant="outline" @click="showSettingsModal = false">Cancel</UButton>
            <UButton @click="saveSettings" :loading="settingsLoading">Save Changes</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Invite Modal -->
    <UModal v-model:open="showInviteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Invite Member</h3>

          <div class="space-y-4">
            <UFormField label="Email">
              <UInput
                v-model="inviteForm.email"
                type="email"
                placeholder="member@example.com"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Role">
              <USelect v-model="inviteForm.role" class="w-full">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </USelect>
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <UButton variant="outline" @click="showInviteModal = false">Cancel</UButton>
            <UButton @click="sendInvite" :loading="inviteLoading">Send Invitation</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4 text-error">Delete Organization</h3>

          <p class="text-muted mb-4">
            This action cannot be undone. Please type <strong>{{ org?.name }}</strong> to confirm.
          </p>

          <UFormField label="Organization Name">
            <UInput
              v-model="deleteConfirmName"
              :placeholder="org?.name"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2 mt-6">
            <UButton variant="outline" @click="showDeleteModal = false">Cancel</UButton>
            <UButton
              color="error"
              @click="handleDeleteOrganization"
              :loading="deleteLoading"
              :disabled="deleteConfirmName !== org?.name"
            >
              Delete Organization
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
