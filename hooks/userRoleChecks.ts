// hooks/useRoleCheck.ts
import { useUser, useOrganization } from "@clerk/clerk-react";

export function useRoleCheck(requiredRole: string) {
    const { user } = useUser();
    const { organization } = useOrganization();

    const hasPermission = user && organization && organization.membership?.role === requiredRole;

    return {
        hasPermission,
        isLoading: !user || !organization,
    };
}