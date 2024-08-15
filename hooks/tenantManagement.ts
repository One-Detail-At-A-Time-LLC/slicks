import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

interface Tenant {
    _id: Id<'tenants'>;
    name: string;
    ownerId: string;
    pricingStructure: Array<{
        serviceName: string;
        basePrice: number;
        sizeMultiplier: {
            small: number;
            medium: number;
            large: number;
        };
    }>;
    costOfGoods: Array<{
        itemName: string;
        cost: number;
    }>;
    laborCost: number;
    qrCode: string;
}

export function useTenant() {
    const { user } = useUser();
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const getTenant = useQuery(api.tenant.getByOwnerId);
    const createTenant = useMutation(api.tenant.create);

    useEffect(() => {
        if (user) {
            const fetchTenant = async () => {
                const existingTenant = await getTenant(user.id);
                if (existingTenant) {
                    setTenant(existingTenant);
                } else {
                    const newTenant = await createTenant({
                        name: `${user.firstName}'s Auto Detailing`,
                        ownerId: user.id,
                        pricingStructure: [],
                        costOfGoods: [],
                        laborCost: 0,
                        qrCode: '', // Generate QR code here
                    });
                    setTenant(newTenant);
                }
            };
            fetchTenant();
        }
    }, [user, getTenant, createTenant]);

    return tenant;
}