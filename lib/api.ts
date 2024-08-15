import useSWR from 'swr';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEstimates(tenantId: string) {
    return useSWR(`/api/estimates?tenantId=${tenantId}`, fetcher);
}

export function useAppointments(tenantId: string) {
    return useSWR(`/api/appointments?tenantId=${tenantId}`, fetcher);
}

export function useTenantData(tenantId: string) {
    return useConvexQuery(api.tenant.getById, { id: tenantId });
}