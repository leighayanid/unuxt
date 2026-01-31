<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "Profile - UNuxt",
});

const { user, updateProfile } = useAuth();
const { uploadImage, isUploading } = useCloudinaryUpload();
const toast = useToast();

const form = reactive({
  name: user.value?.name || "",
  image: user.value?.image || "",
});
const loading = ref(false);

watch(user, (newUser) => {
  if (newUser) {
    form.name = newUser.name || "";
    form.image = newUser.image || "";
  }
});

async function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadImage(file, { folder: "avatars" });
    form.image = result.secure_url;
    toast.add({
      title: "Success",
      description: "Avatar uploaded successfully",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to upload avatar",
      color: "error",
    });
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    await updateProfile({
      name: form.name,
      image: form.image,
    });
    toast.add({
      title: "Success",
      description: "Profile updated successfully",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to update profile",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Profile</h1>

    <UCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Avatar -->
        <div class="flex items-center gap-6">
          <UAvatar
            :src="form.image"
            :alt="form.name"
            size="xl"
          />
          <div>
            <label class="cursor-pointer">
              <UButton
                as="span"
                variant="outline"
                :loading="isUploading"
              >
                {{ isUploading ? "Uploading..." : "Change Avatar" }}
              </UButton>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
            </label>
            <p class="text-sm text-muted mt-2">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>

        <!-- Name -->
        <UFormField label="Name" name="name">
          <UInput
            v-model="form.name"
            type="text"
            placeholder="Your name"
          />
        </UFormField>

        <!-- Email (read-only) -->
        <UFormField label="Email" name="email">
          <UInput
            :model-value="user?.email"
            type="email"
            disabled
          />
          <template #hint>
            <span class="text-muted">Email cannot be changed</span>
          </template>
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" :loading="loading">
            Save Changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
