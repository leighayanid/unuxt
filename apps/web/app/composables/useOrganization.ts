export function useOrganization() {
  const { $authClient } = useNuxtApp();
  const activeOrg = $authClient.useActiveOrganization();
  const organizations = $authClient.useListOrganizations();

  const activeOrgData = computed(() => activeOrg.value?.data || null);
  const organizationsList = computed(() => organizations.value?.data || []);

  async function createOrganization(name: string, slug: string, logo?: string) {
    const result = await $authClient.organization.create({
      name,
      slug,
      logo,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function switchOrganization(organizationId: string) {
    const result = await $authClient.organization.setActive({
      organizationId,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function updateOrganization(data: {
    name?: string;
    slug?: string;
    logo?: string;
  }) {
    const result = await $authClient.organization.update(data);
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function deleteOrganization(organizationId: string) {
    const result = await $authClient.organization.delete({
      organizationId,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function inviteMember(email: string, role: "admin" | "member") {
    const result = await $authClient.organization.inviteMember({
      email,
      role,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function removeMember(memberId: string) {
    const result = await $authClient.organization.removeMember({
      memberIdOrEmail: memberId,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function updateMemberRole(memberId: string, role: string) {
    const result = await $authClient.organization.updateMemberRole({
      memberId,
      role,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  async function cancelInvitation(invitationId: string) {
    const result = await $authClient.organization.cancelInvitation({
      invitationId,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  }

  return {
    activeOrg: activeOrgData,
    organizations: organizationsList,
    createOrganization,
    switchOrganization,
    updateOrganization,
    deleteOrganization,
    inviteMember,
    removeMember,
    updateMemberRole,
    cancelInvitation,
  };
}
