// File: convex/appointment.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const schedule = mutation({
    args: {
        tenantId: v.id('tenants'),
        estimateId: v.id('estimates'),
        startTime: v.number(),
    },
    handler: async (ctx, args) => {
        const estimate = await ctx.db.get(args.estimateId);
        if (!estimate) throw new Error('Estimate not found');
        if (estimate.tenantId !== args.tenantId) throw new Error('Unauthorized');

        const appointment = {
            estimateId: args.estimateId,
            startTime: args.startTime,
            endTime: args.startTime + 2 * 60 * 60 * 1000, // 2 hours duration
            status: 'scheduled',
            depositPaid: false,
        };

        return await ctx.db.insert('appointments', appointment);
    },
});

export const getUpcoming = query({
    args: { tenantId: v.id('tenants'), limit: v.number() },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db
            .query('appointments')
            .filter(q =>
                q.and(
                    q.eq(q.field('status'), 'scheduled'),
                    q.gt(q.field('startTime'), now)
                )
            )
            .order('asc')
            .take(args.limit);
    },
});