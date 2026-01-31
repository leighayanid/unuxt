import { DEFAULT_ROLE_PERMISSIONS, type Permission } from "@unuxt/utils";

export function usePermissions() {
  const { activeOrg } = useOrganization();
  const { user } = useAuth();

  const currentMember = computed(() => {
    if (!activeOrg.value || !user.value) return null;
    return activeOrg.value.members?.find(
      (m: any) => m.userId === user.value?.id
    );
  });

  const currentRole = computed(() => currentMember.value?.role || null);

  function hasPermission(permission: Permission): boolean {
    if (!currentRole.value) return false;
    const rolePermissions =
      DEFAULT_ROLE_PERMISSIONS[currentRole.value] || [];
    return rolePermissions.includes(permission);
  }

  function hasRole(role: string | string[]): boolean {
    if (!currentRole.value) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(currentRole.value);
  }

  const isOwner = computed(() => hasRole("owner"));
  const isAdmin = computed(() => hasRole(["owner", "admin"]));
  const isMember = computed(() => hasRole(["owner", "admin", "member"]));

  const canManageMembers = computed(() =>
    hasPermission("member:invite") || hasPermission("member:remove")
  );
  const canUpdateOrg = computed(() => hasPermission("organization:update"));
  const canDeleteOrg = computed(() => hasPermission("organization:delete"));

  return {
    currentMember,
    currentRole,
    hasPermission,
    hasRole,
    isOwner,
    isAdmin,
    isMember,
    canManageMembers,
    canUpdateOrg,
    canDeleteOrg,
  };
}
