import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const generate = mutation({
    args: {
        tenantId: v.id('tenants'),
        clientId: v.id('clients'),
        vehicleId: v.id('vehicles'),
        services: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error('Tenant not found');

        const vehicle = await ctx.db.get(args.vehicleId);
        if (!vehicle) throw new Error('Vehicle not found');

        let totalPrice = 0;
        for (const service of args.services) {
            const pricing = tenant.pricingStructure.find(p => p.serviceName === service);
            if (pricing) {
                totalPrice += pricing.basePrice * pricing.sizeMultiplier[vehicle.size];
            }
        }

        const estimate = {
            tenantId: args.tenantId,
            clientId: args.clientId,
            vehicleId: args.vehicleId,
            services: args.services,
            totalPrice,
            status: 'pending' as const,
            createdAt: Date.now(),
        };

        return await ctx.db.insert('estimates', estimate);
    },
});

export const getRecent = query({
    args: { tenantId: v.id('tenants'), limit: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('estimates')
            .filter(q => q.eq(q.field('tenantId'), args.tenantId))
            .order('desc')
            .take(args.limit);
    },
});