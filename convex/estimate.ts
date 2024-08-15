// File: convex/estimate.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const generate = mutation({
    args: {
        tenantId: v.id('tenants'),
        clientName: v.string(),
        vehicleMake: v.string(),
        vehicleModel: v.string(),
        vehicleYear: v.number(),
        vehicleSize: v.union(v.literal('small'), v.literal('medium'), v.literal('large')),
        services: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error('Tenant not found');

        let totalPrice = 0;
        for (const service of args.services) {
            const pricing = tenant.pricingStructure.find(p => p.serviceName === service);
            if (pricing) {
                totalPrice += pricing.basePrice * pricing.sizeMultiplier[args.vehicleSize];
            }
        }

        const estimate = {
            tenantId: args.tenantId,
            clientName: args.clientName,
            vehicleMake: args.vehicleMake,
            vehicleModel: args.vehicleModel,
            vehicleYear: args.vehicleYear,
            vehicleSize: args.vehicleSize,
            services: args.services,
            totalPrice,
            status: 'pending',
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