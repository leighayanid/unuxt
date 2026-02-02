export function useAuth() {
  const { $authClient } = useNuxtApp();
  const session = $authClient.useSession();
  const user = computed(() => session.value?.data?.user || null);
  const isAuthenticated = computed(() => !!session.value?.data?.session);
  const isLoading = computed(() => session.value?.isPending ?? true);
  const isGlobalAdmin = computed(() => user.value?.role === "admin");

  async function login(email: string, password: string) {
    const result = await $authClient.signIn.email({
      email,
      password,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function loginWithGoogle() {
    return $authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  async function loginWithGitHub() {
    return $authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  }

  async function loginWithMagicLink(email: string) {
    const result = await $authClient.signIn.magicLink({
      email,
      callbackURL: "/dashboard",
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function register(email: string, password: string, name: string) {
    const result = await $authClient.signUp.email({
      email,
      password,
      name,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function logout() {
    await $authClient.signOut();
    await navigateTo("/");
  }

  async function updateProfile(data: { name?: string; image?: string }) {
    const result = await $authClient.updateUser(data);
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function forgotPassword(email: string) {
    const result = await $authClient.forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function resetPassword(token: string, newPassword: string) {
    const result = await $authClient.resetPassword({
      token,
      newPassword,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function verifyEmail(token: string) {
    const result = await $authClient.verifyEmail({
      token,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function resendVerificationEmail() {
    const result = await $authClient.sendVerificationEmail({
      email: user.value?.email || "",
      callbackURL: "/auth/login",
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    isGlobalAdmin,
    login,
    loginWithGoogle,
    loginWithGitHub,
    loginWithMagicLink,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
  };
}
