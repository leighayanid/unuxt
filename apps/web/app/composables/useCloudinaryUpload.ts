interface UploadOptions {
  folder?: string;
}

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export function useCloudinaryUpload() {
  const config = useRuntimeConfig();
  const isUploading = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);

  async function uploadImage(
    file: File,
    options?: UploadOptions
  ): Promise<UploadResult> {
    isUploading.value = true;
    error.value = null;
    progress.value = 0;

    try {
      // Get signed upload params from server
      const signatureData = await $fetch("/api/upload/signature", {
        method: "POST",
        body: { folder: options?.folder },
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("signature", signatureData.signature);
      if (options?.folder) {
        formData.append("folder", options.folder);
      }

      const result = await $fetch<UploadResult>(
        `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      progress.value = 100;
      return result;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      isUploading.value = false;
    }
  }

  return {
    uploadImage,
    isUploading,
    progress,
    error,
  };
}
