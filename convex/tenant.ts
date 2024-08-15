// File: convex/tenant.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
    args: {
        name: v.string(),
        ownerId: v.string(),
        pricingStructure: v.array(v.object({
            serviceName: v.string(),
            basePrice: v.number(),
            sizeMultiplier: v.object({
                small: v.number(),
                medium: v.number(),
                large: v.number(),
            }),
        })),
        costOfGoods: v.array(v.object({
            itemName: v.string(),
            cost: v.number(),
        })),
        laborCost: v.number(),
        qrCode: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('tenants', args);
    },
});

export const getById = query({
    args: { id: v.id('tenants') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByOwnerId = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('tenants')
            .filter(q => q.eq(q.field('ownerId'), args.ownerId))
            .first();
    },
});
