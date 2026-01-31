<script setup lang="ts">
import { slugify } from "@unuxt/utils";

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "Create Organization - UNuxt",
});

const { createOrganization } = useOrganization();
const { uploadImage, isUploading } = useCloudinaryUpload();
const toast = useToast();
const router = useRouter();

const form = reactive({
  name: "",
  slug: "",
  logo: "",
});
const loading = ref(false);
const autoSlug = ref(true);

watch(
  () => form.name,
  (name) => {
    if (autoSlug.value) {
      form.slug = slugify(name);
    }
  }
);

function handleSlugInput() {
  autoSlug.value = false;
}

async function handleLogoUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadImage(file, { folder: "org-logos" });
    form.logo = result.secure_url;
    toast.add({
      title: "Success",
      description: "Logo uploaded successfully",
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

async function handleSubmit() {
  loading.value = true;
  try {
    const org = await createOrganization(form.name, form.slug, form.logo);
    toast.add({
      title: "Success",
      description: "Organization created successfully",
      color: "success",
    });
    router.push(`/org/${org.id}`);
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to create organization",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Create Organization</h1>

    <UCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Logo -->
        <div class="flex items-center gap-6">
          <UAvatar
            :src="form.logo"
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
                {{ isUploading ? "Uploading..." : "Upload Logo" }}
              </UButton>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
            </label>
            <p class="text-sm text-muted mt-2">
              Optional. JPG, PNG or GIF.
            </p>
          </div>
        </div>

        <!-- Name -->
        <UFormField label="Organization Name" name="name" required>
          <UInput
            v-model="form.name"
            type="text"
            placeholder="My Organization"
            required
          />
        </UFormField>

        <!-- Slug -->
        <UFormField label="URL Slug" name="slug" required>
          <UInput
            v-model="form.slug"
            type="text"
            placeholder="my-organization"
            required
            @input="handleSlugInput"
          />
          <template #hint>
            <span class="text-muted">This will be used in URLs</span>
          </template>
        </UFormField>

        <div class="flex justify-end gap-4">
          <UButton variant="outline" @click="router.back()">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading">
            Create Organization
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
