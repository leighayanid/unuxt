export default defineNuxtRouteMiddleware(async () => {
  const { user, isLoading } = useAuth();

  // Wait for session to load
  if (isLoading.value) {
    await new Promise((resolve) => {
      const unwatch = watch(isLoading, (loading) => {
        if (!loading) {
          unwatch();
          resolve(true);
        }
      });
    });
  }

  // Check if user is a global admin
  if (user.value?.role !== "admin") {
    return navigateTo("/dashboard");
  }
});
