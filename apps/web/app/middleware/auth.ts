export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated.value) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
